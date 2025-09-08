var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-Ue4X6s/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/index.js
function getDatabase(env) {
  return env.DB_DEV || env.DB;
}
__name(getDatabase, "getDatabase");
function generateAccessCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
__name(generateAccessCode, "generateAccessCode");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
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
          break;
        case "DELETE":
          if (path.startsWith("/api/events/")) return handleDeleteEvent(request, env);
          break;
      }
      return createErrorResponse(`Endpoint not found: ${path}`, 404);
    } catch (err) {
      console.error("\u274C Worker error:", err);
      return createErrorResponse("Internal server error", 500, err.message);
    }
  }
};
function createErrorResponse(message, status = 500, details = null) {
  const body = { error: message };
  if (details && true) body.details = details;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(createErrorResponse, "createErrorResponse");
function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
__name(handleOptionsRequest, "handleOptionsRequest");
function handleRoot() {
  return new Response(
    JSON.stringify({
      message: "Cloudflare Worker is running",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      availableEndpoints: {
        "POST /register": "User registration",
        "POST /login": "User login",
        "GET /user/stats": "User statistics (requires auth)",
        "POST /api/events": "Create event",
        "GET /api/events": "Get events",
        "DELETE /api/events/:id": "Delete event"
      }
    }),
    { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  );
}
__name(handleRoot, "handleRoot");
async function initializeDatabase(env) {
  const db = getDatabase(env);
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
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT,
      login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();
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
__name(initializeDatabase, "initializeDatabase");
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
__name(handleRegistrationRequest, "handleRegistrationRequest");
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
    await db.prepare(`INSERT INTO user_sessions (user_id, token) VALUES (?, ?)`).bind(user.id, token).run();
    await db.prepare(`UPDATE users SET last_login = datetime('now'), login_count = COALESCE(login_count,0)+1, updated_at = datetime('now') WHERE id = ?`).bind(user.id).run();
    return new Response(JSON.stringify({ success: true, user: userData, token }), { status: 200, headers });
  } catch (err) {
    return createErrorResponse("Login failed", 500, err.message);
  }
}
__name(handleLoginRequest, "handleLoginRequest");
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
__name(getUserIdFromToken, "getUserIdFromToken");
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
__name(handleUserStats, "handleUserStats");
async function handleUserUpdate(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return createErrorResponse("Unauthorized", 401);
  const token = authHeader.slice(7);
  const userId = await getUserIdFromToken(token, env);
  const { name, email, phone, role } = await request.json();
  if (!name || !email || !phone || !["END_USER", "PREMIUM_USER"].includes(role)) return createErrorResponse("Invalid fields", 400);
  const db = getDatabase(env);
  await db.prepare(`UPDATE users SET name = ?, email = ?, phone = ?, role = ?, updated_at = datetime('now') WHERE id = ?`).bind(name, email, phone, role, userId).run();
  return new Response(JSON.stringify({ success: true, message: "User updated successfully" }), { status: 200, headers });
}
__name(handleUserUpdate, "handleUserUpdate");
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
    if (!["Standard", "Premium"].includes(planType)) return createErrorResponse("Invalid plan type", 400);
    const role = planType === "Premium" ? "PREMIUM_USER" : "END_USER";
    const accessCode = role === "PREMIUM_USER" ? generateAccessCode() : null;
    await db.prepare(`UPDATE users SET role = ?, access_code = ?, updated_at = datetime('now') WHERE id = ?`).bind(role, accessCode, userId).run();
    return new Response(JSON.stringify({ success: true, role, ...accessCode && { accessCode }, message: `Subscription updated to ${planType}` }), { status: 200, headers });
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
__name(handleSubscribeRequest, "handleSubscribeRequest");
async function handleGetEvents(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  await initializeDatabase(env);
  const db = getDatabase(env);
  const result = await db.prepare(`SELECT * FROM events ORDER BY startTime`).all();
  return new Response(JSON.stringify({ success: true, events: result.results || [] }), { status: 200, headers });
}
__name(handleGetEvents, "handleGetEvents");
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
__name(handleCreateEvent, "handleCreateEvent");
async function handleDeleteEvent(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const url = new URL(request.url);
  const eventId = url.pathname.split("/").pop();
  if (!eventId || isNaN(eventId)) return createErrorResponse("Invalid event ID", 400);
  const db = getDatabase(env);
  const event = await db.prepare(`SELECT id FROM events WHERE id = ?`).bind(eventId).first();
  if (!event) return createErrorResponse("Event not found", 404);
  await db.prepare(`DELETE FROM events WHERE id = ?`).bind(eventId).run();
  return new Response(JSON.stringify({ success: true, message: "Event deleted", id: eventId }), { status: 200, headers });
}
__name(handleDeleteEvent, "handleDeleteEvent");

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// .wrangler/tmp/bundle-Ue4X6s/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Ue4X6s/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
