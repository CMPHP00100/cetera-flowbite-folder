// src/index.js - Cloudflare Worker with simplified roles

// Helper function to get the appropriate database
function getDatabase(env) {
  return env.DB_DEV || env.DB;
}

function generateAccessCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") return handleOptionsRequest();

    const path = url.pathname.toLowerCase();

    try {
      switch (request.method) {
        case "GET":
          if (path === "/") return handleRoot();
          if (path === "/user/stats") return handleUserStats(request, env);
          if (path === "/api/events") return handleGetEvents(request, env);
          break;
        case "POST":
          if (path === "/register" || path === "/api/auth/register") return handleRegistrationRequest(request, env);
          if (path === "/login" || path === "/api/auth/login") return handleLoginRequest(request, env);
          if (path === "/api/events") return handleCreateEvent(request, env);
          if (path === "/user/update") return handleUserUpdate(request, env);
          break;
        case "PUT":
          if (path === `${process.env.NEXT_PUBLIC_API_BASE}/api/subscribe`) return handleSubscribeRequest(request, env);
          //if (path === "/api/subscribe") return handleSubscribeRequest(request, env);
          break;
        case "DELETE":
          if (path.startsWith("/api/events/")) return handleDeleteEvent(request, env);
          break;
      }

      return createErrorResponse(`Endpoint not found: ${path}`, 404);
    } catch (err) {
      console.error("❌ Worker error:", err);
      return createErrorResponse("Internal server error", 500, err.message);
    }
  },
};

// ====================== Helper Functions ======================

function createErrorResponse(message, status = 500, details = null) {
  const body = { error: message };
  if (details && process.env.NODE_ENV !== "production") body.details = details;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function handleRoot() {
  return new Response(
    JSON.stringify({
      message: "Cloudflare Worker is running",
      timestamp: new Date().toISOString(),
      availableEndpoints: {
        "POST /register": "User registration",
        "POST /login": "User login",
        "GET /user/stats": "User statistics (requires auth)",
        "POST /api/events": "Create event",
        "GET /api/events": "Get events",
        "DELETE /api/events/:id": "Delete event",
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  );
}

// ====================== Database Initialization ======================

async function initializeDatabase(env) {
  const db = getDatabase(env);

  // Users table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'END_USER' CHECK(role IN ('END_USER','PREMIUM_USER')),
      access_code TEXT,
      login_count INTEGER DEFAULT 0,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Events table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // User sessions table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT,
      login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  // Profile views table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS profile_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      viewed_user_id INTEGER NOT NULL,
      viewer_user_id INTEGER,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (viewed_user_id) REFERENCES users(id),
      FOREIGN KEY (viewer_user_id) REFERENCES users(id)
    )
  `).run();

  // Premium access table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS premium_access (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      access_code TEXT NOT NULL,
      granted_by INTEGER,
      granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (granted_by) REFERENCES users(id)
    )
  `).run();
}

// ====================== Authentication ======================

async function handleRegistrationRequest(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  await initializeDatabase(env);

  try {
    const { name, email, phone, password } = await request.json();
    if (!name || !email || !phone || !password) return createErrorResponse("Missing fields", 400);

    const db = getDatabase(env);

    const sql = `
      INSERT INTO users (name, email, phone, password, role, created_at)
      VALUES (?, ?, ?, ?, 'END_USER', datetime('now'))
    `;
    const result = await db.prepare(sql).bind(name.trim(), email.trim().toLowerCase(), phone.trim(), password).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id, message: "User registered successfully" }), { status: 201, headers });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) return createErrorResponse("Email already exists", 409);
    return createErrorResponse("Registration failed", 500, err.message);
  }
}

async function handleLoginRequest(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  await initializeDatabase(env);

  try {
    const { email, password } = await request.json();
    if (!email || !password) return createErrorResponse("Email and password required", 400);

    const db = getDatabase(env);
    const user = await db.prepare(`SELECT * FROM users WHERE email = ?`).bind(email.toLowerCase().trim()).first();

    if (!user || user.password !== password) return createErrorResponse("Invalid email or password", 401);

    const userData = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
    const token = btoa(JSON.stringify(userData));

    // Track session
    await db.prepare(`INSERT INTO user_sessions (user_id, token) VALUES (?, ?)`).bind(user.id, token).run();
    await db.prepare(`UPDATE users SET last_login = datetime('now'), login_count = COALESCE(login_count,0)+1, updated_at = datetime('now') WHERE id = ?`).bind(user.id).run();

    return new Response(JSON.stringify({ success: true, user: userData, token }), { status: 200, headers });
  } catch (err) {
    return createErrorResponse("Login failed", 500, err.message);
  }
}

async function getUserIdFromToken(token, env) {
  try {
    const userData = JSON.parse(atob(token));
    const db = getDatabase(env);
    const user = await db.prepare(`SELECT id FROM users WHERE id = ?`).bind(userData.id).first();
    if (!user) throw new Error("User not found");
    return userData.id;
  } catch {
    throw new Error("Invalid token");
  }
}

// ====================== User Stats & Update ======================

async function handleUserStats(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return createErrorResponse("Unauthorized", 401);

  const token = authHeader.slice(7);
  const userId = await getUserIdFromToken(token, env);
  const db = getDatabase(env);

  const result = await db.prepare(`
    SELECT name, login_count AS loginCount, last_login AS lastLogin, created_at AS memberSince,
           (SELECT COUNT(*) FROM profile_views WHERE viewed_user_id = ?) AS profileViews
    FROM users WHERE id = ?
  `).bind(userId, userId).first();

  if (!result) return createErrorResponse("User not found", 404);

  return new Response(JSON.stringify({
    loginCount: result.loginCount || 0,
    lastLogin: result.lastLogin || null,
    memberSince: result.memberSince || null,
    profileViews: result.profileViews || 0,
    name: result.name
  }), { status: 200, headers });
}

async function handleUserUpdate(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return createErrorResponse("Unauthorized", 401);

  const token = authHeader.slice(7);
  const userId = await getUserIdFromToken(token, env);
  const { name, email, phone, role } = await request.json();

  if (!name || !email || !phone || !["END_USER","PREMIUM_USER"].includes(role)) return createErrorResponse("Invalid fields", 400);

  const db = getDatabase(env);
  await db.prepare(`UPDATE users SET name = ?, email = ?, phone = ?, role = ?, updated_at = datetime('now') WHERE id = ?`).bind(name, email, phone, role, userId).run();

  return new Response(JSON.stringify({ success: true, message: "User updated successfully" }), { status: 200, headers });
}

// ====================== Subscription ======================

async function handleSubscribeRequest(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return createErrorResponse("Unauthorized", 401);

  const token = authHeader.slice(7);
  const userId = await getUserIdFromToken(token, env);
  const body = await request.json();
  const db = getDatabase(env);

  if (body.planType) {
    const planType = body.planType;
    if (!["Standard","Premium"].includes(planType)) return createErrorResponse("Invalid plan type", 400);

    const role = planType === "Premium" ? "PREMIUM_USER" : "END_USER";
    const accessCode = role === "PREMIUM_USER" ? generateAccessCode() : null;

    await db.prepare(`UPDATE users SET role = ?, access_code = ?, updated_at = datetime('now') WHERE id = ?`).bind(role, accessCode, userId).run();

    return new Response(JSON.stringify({ success: true, role, ...(accessCode && { accessCode }), message: `Subscription updated to ${planType}` }), { status: 200, headers });
  }

  if (body.accessCode) {
    const accessCode = body.accessCode.trim().toUpperCase();
    const premiumUser = await db.prepare(`SELECT id, name, email FROM users WHERE access_code = ? AND role = 'PREMIUM_USER'`).bind(accessCode).first();
    if (!premiumUser) return createErrorResponse("Invalid access code", 404);

    await db.prepare(`INSERT OR REPLACE INTO premium_access (user_id, access_code, granted_by) VALUES (?, ?, ?)`).bind(userId, accessCode, premiumUser.id).run();

    return new Response(JSON.stringify({ success: true, message: `Premium access granted by ${premiumUser.name || premiumUser.email}` }), { status: 200, headers });
  }

  return createErrorResponse("Missing planType or accessCode", 400);
}

// ====================== Events ======================

async function handleGetEvents(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  await initializeDatabase(env);

  const db = getDatabase(env);
  const result = await db.prepare(`SELECT * FROM events ORDER BY startTime`).all();

  return new Response(JSON.stringify({ success: true, events: result.results || [] }), { status: 200, headers });
}

async function handleCreateEvent(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  await initializeDatabase(env);

  const { title, description, location, startTime, endTime } = await request.json();
  if (!title || !description || !location || !startTime || !endTime) return createErrorResponse("Missing event fields", 400);

  const start = new Date(startTime), end = new Date(endTime);
  if (isNaN(start) || isNaN(end) || end <= start) return createErrorResponse("Invalid event times", 400);

  const db = getDatabase(env);
  const result = await db.prepare(`INSERT INTO events (title, description, location, startTime, endTime, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`).bind(title, description, location, startTime, endTime).run();

  return new Response(JSON.stringify({ success: true, message: "Event created", id: result.meta.last_row_id }), { status: 201, headers });
}

async function handleDeleteEvent(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const url = new URL(request.url);
  const eventId = url.pathname.split('/').pop();

  if (!eventId || isNaN(eventId)) return createErrorResponse("Invalid event ID", 400);

  const db = getDatabase(env);
  const event = await db.prepare(`SELECT id FROM events WHERE id = ?`).bind(eventId).first();
  if (!event) return createErrorResponse("Event not found", 404);

  await db.prepare(`DELETE FROM events WHERE id = ?`).bind(eventId).run();
  return new Response(JSON.stringify({ success: true, message: "Event deleted", id: eventId }), { status: 200, headers });
}
