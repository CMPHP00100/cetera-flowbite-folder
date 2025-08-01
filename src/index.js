// src/index.js - Complete Cloudflare Worker with proper error handling

// Helper function to get the appropriate database
function getDatabase(env) {
  console.log('Available env bindings:', Object.keys(env));
  console.log('DB_DEV available:', !!env.DB_DEV);
  console.log('DB available:', !!env.DB);
  
  const db = env.DB_DEV || env.DB;
  console.log('Using database:', db === env.DB_DEV ? 'DB_DEV' : 'DB');
  return db;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    console.log("📍 Incoming path:", url.pathname);
    console.log("🔧 Method:", request.method);
    
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleOptionsRequest();
    } 
    
    // Handle root path for testing
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({
        message: "Cloudflare Worker is running",
        timestamp: new Date().toISOString(),
        availableEndpoints: {
          "POST /register": "User registration",
          "POST /login": "User login", 
          "GET /user/stats": "User statistics (requires auth)",
          "POST /api/events": "Create event",
          "GET /api/events": "Get events",
          "DELETE /api/events/:id": "Delete event"
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });
    }
    
    // POST requests
    if (request.method === "POST") {
      const path = url.pathname.toLowerCase();
      
      if (path === "/login" || path === "/api/auth/login") {
        return handleLoginRequest(request, env);
      } 
      else if (path === "/register" || path === "/api/auth/register") {
        return handleRegistrationRequest(request, env);
      } 
      else if (path === "/api/events") {
        return handleCreateEvent(request, env);
      } 
      else if (path === "/user/update") {
        return handleUserUpdate(request, env);
      } 
      else {
        console.log("❌ Unknown POST path:", path);
        return createErrorResponse(`POST endpoint not found: ${path}`, 404);
      }
    } 
    
    // GET requests
    if (request.method === "GET") {
      const path = url.pathname.toLowerCase();
      
      if (path === "/user/stats") {
        return handleUserStats(request, env);
      } 
      else if (path === "/api/events") {
        return handleGetEvents(request, env);
      }
      else {
        return createErrorResponse(`GET endpoint not found: ${path}`, 404);
      }
    } 
    
    // DELETE requests
    if (request.method === "DELETE") {
      if (url.pathname.startsWith("/api/events/")) {
        return handleDeleteEvent(request, env);
      } else {
        return createErrorResponse("DELETE endpoint not found", 404);
      }
    }
    
    return createErrorResponse("Method not allowed", 405);
  },
};

// Helper function to create consistent error responses
function createErrorResponse(message, status = 500, details = null) {
  const responseBody = { error: message };
  if (details && process.env.NODE_ENV !== 'production') {
    responseBody.details = details;
  }
  
  return new Response(
    JSON.stringify(responseBody),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

// Handle CORS preflight requests
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

// Initialize database tables if they don't exist
async function initializeDatabase(env) {
  try {
    const db = getDatabase(env);
    
    // Create users table with all necessary columns
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'END_USER',
        login_count INTEGER DEFAULT 0,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    
    // Create events table
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
    
    // Create user_sessions table for tracking logins
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        token TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `).run();
    
    // Create profile_views table for stats
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
    
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Registration handler with comprehensive validation
async function handleRegistrationRequest(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    console.log("🔍 Registration request received");
    
    // Initialize database first
    await initializeDatabase(env);
    
    const body = await request.json();
    const { name, email, phone, password, role = "END_USER" } = body;

    console.log("📝 Registration data:", { name, email, phone, role });

    // Comprehensive validation
    const validationErrors = [];
    
    if (!name?.trim()) validationErrors.push("Name is required");
    if (!email?.trim()) validationErrors.push("Email is required");
    if (!phone?.trim()) validationErrors.push("Phone is required");
    if (!password?.trim()) validationErrors.push("Password is required");
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
      validationErrors.push("Invalid email format");
    }
    
    // Password strength validation
    if (password && password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long");
    }
    
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: validationErrors.join(", ") }),
        { status: 400, headers }
      );
    }

    console.log("✅ Validation passed, inserting into database");

    const db = getDatabase(env);
    const sql = `INSERT INTO users (name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
    
    const result = await db.prepare(sql)
      .bind(name.trim(), email.trim().toLowerCase(), phone.trim(), password, role)
      .run();

    console.log("📊 Database result:", result);

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          id: result.meta.last_row_id,
          message: "User registered successfully"
        }),
        { status: 201, headers }
      );
    } else {
      throw new Error("Database insertion failed");
    }

  } catch (err) {
    console.error("❌ Registration error:", err);
    
    // Handle specific database errors
    if (err.message.includes("UNIQUE constraint failed") || err.message.includes("email")) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists" }),
        { status: 409, headers }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Registration failed", 
        details: err.message 
      }),
      { status: 500, headers }
    );
  }
}

// Login handler with session tracking
async function handleLoginRequest(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    console.log("🔍 Login request received");
    
    // Initialize database first
    await initializeDatabase(env);
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers }
      );
    }

    const db = getDatabase(env);
    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await db.prepare(sql).bind(email.toLowerCase().trim()).first();

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers }
      );
    }

    // In production, you should hash passwords!
    if (result.password !== password) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers }
      );
    }

    const userData = {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      role: result.role
    };

    const token = btoa(JSON.stringify(userData));
    console.log("🔑 Generated token for user:", result.id);

    // Track this login session
    try {
      await db.prepare(`
        INSERT INTO user_sessions (user_id, token) VALUES (?, ?)
      `).bind(result.id, token).run();

      // Update user's last login time and count
      await db.prepare(`
        UPDATE users 
        SET 
          last_login = datetime('now'),
          login_count = COALESCE(login_count, 0) + 1,
          updated_at = datetime('now')
        WHERE id = ?
      `).bind(result.id).run();
      
      console.log("✅ Login session tracked successfully");
    } catch (sessionError) {
      console.error('⚠️ Error tracking login session:', sessionError);
      // Don't fail the login if session tracking fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData,
        token: token
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("❌ Login error:", err);
    return new Response(
      JSON.stringify({ error: "Login failed", details: err.message }),
      { status: 500, headers }
    );
  }
}

// Helper function to verify token and get user ID
async function getUserIdFromToken(token, env) {
  try {
    const userData = JSON.parse(atob(token));

    // Validate against database that session is legitimate
    const db = getDatabase(env);
    const session = await db.prepare(`
      SELECT user_id FROM user_sessions WHERE token = ? ORDER BY login_time DESC LIMIT 1
    `).bind(token).first();

    if (!session || session.user_id !== userData.id) {
      throw new Error("Invalid or expired session");
    }

    return userData.id;
  } catch (err) {
    console.error("Failed to decode token or validate session:", err);
    throw new Error("Invalid token");
  }
}

// Handle user stats endpoint
async function handleUserStats(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.slice(7);
    const userId = await getUserIdFromToken(token, env);
    
    console.log("📊 Stats lookup for userId:", userId);
    
    const db = getDatabase(env);
    const result = await db.prepare(`
      SELECT 
        name,
        login_count AS loginCount,
        last_login AS lastLogin,
        created_at AS memberSince,
        (SELECT COUNT(*) FROM profile_views WHERE viewed_user_id = ?) AS profileViews
      FROM users 
      WHERE id = ?
    `).bind(userId, userId).first();

    console.log("📊 Stats DB result:", result);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers }
      );
    }

    return new Response(JSON.stringify({
      loginCount: result.loginCount || 0,
      lastLogin: result.lastLogin || null,
      memberSince: result.memberSince || null,
      profileViews: result.profileViews || 0,
      name: result.name || null
    }), {
      status: 200,
      headers
    });
    
  } catch (err) {
    console.error("❌ User stats error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stats", details: err.message }),
      { status: 500, headers }
    );
  }
}

// Handle user update
async function handleUserUpdate(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers }
      );
    }

    const token = authHeader.slice(7);
    const userId = await getUserIdFromToken(token, env);

    const body = await request.json();
    const { name, email, phone, role } = body;

    if (!name || !email || !phone || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers }
      );
    }

    const db = getDatabase(env);
    await db.prepare(`
      UPDATE users
      SET name = ?, email = ?, phone = ?, role = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(name, email, phone, role, userId).run();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );
    
  } catch (err) {
    console.error("❌ User update error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update user", details: err.message }),
      { status: 500, headers }
    );
  }
}

// Get all events
async function handleGetEvents(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    await initializeDatabase(env);
    
    const db = getDatabase(env);
    const sql = `SELECT id, title, description, location, startTime, endTime, created_at FROM events ORDER BY startTime`;
    const result = await db.prepare(sql).all();

    return new Response(
      JSON.stringify({
        success: true,
        events: result.results || []
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("❌ Get events error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch events", details: err.message }),
      { status: 500, headers }
    );
  }
}

// Create a new event
async function handleCreateEvent(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    await initializeDatabase(env);
    
    const body = await request.json();
    const { title, description, location, startTime, endTime } = body;

    console.log("📅 Received event data:", { title, description, location, startTime, endTime });

    // Validate required fields
    if (!title || !description || !location || !startTime || !endTime) {
      return new Response(
        JSON.stringify({ 
          error: "All fields are required (title, description, location, startTime, endTime)" 
        }),
        { status: 400, headers }
      );
    }

    // Validate time
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid date format for startTime or endTime" 
        }),
        { status: 400, headers }
      );
    }
    
    if (end <= start) {
      return new Response(
        JSON.stringify({ 
          error: "End time must be after start time" 
        }),
        { status: 400, headers }
      );
    }

    const db = getDatabase(env);
    const sql = `INSERT INTO events (title, description, location, startTime, endTime, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
    const result = await db.prepare(sql).bind(title, description, location, startTime, endTime).run();

    console.log("📊 Database insert result:", result);

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Event created successfully", 
          id: result.meta.last_row_id 
        }),
        { status: 201, headers }
      );
    } else {
      throw new Error("Failed to create event in database");
    }
  } catch (err) {
    console.error("❌ Create event error:", err);
    return new Response(
      JSON.stringify({ 
        error: "Failed to create event", 
        details: err.message 
      }),
      { status: 500, headers }
    );
  }
}

// Delete an event
async function handleDeleteEvent(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const eventId = pathParts[pathParts.length - 1];

    if (!eventId || isNaN(eventId)) {
      return new Response(
        JSON.stringify({ error: "Invalid event ID" }),
        { status: 400, headers }
      );
    }

    const db = getDatabase(env);
    
    // First check if the event exists
    const checkSql = `SELECT id FROM events WHERE id = ?`;
    const existingEvent = await db.prepare(checkSql).bind(eventId).first();
    
    if (!existingEvent) {
      return new Response(
        JSON.stringify({ error: "Event not found" }),
        { status: 404, headers }
      );
    }

    // Delete the event
    const deleteSql = `DELETE FROM events WHERE id = ?`;
    const result = await db.prepare(deleteSql).bind(eventId).run();

    if (result.success && result.meta.changes > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Event deleted successfully",
          id: eventId
        }),
        { status: 200, headers }
      );
    } else {
      throw new Error("Failed to delete event");
    }
  } catch (err) {
    console.error("❌ Delete event error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to delete event", details: err.message }),
      { status: 500, headers }
    );
  }
}