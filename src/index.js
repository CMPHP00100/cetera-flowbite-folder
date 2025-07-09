// src/index.js - Updated Cloudflare Worker with User Stats

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
    
    if (request.method === "OPTIONS") {
      return handleOptionsRequest();
    } else if (request.method === "POST") {
      // Route based on pathname
      if (url.pathname === "/login") {
        return handleLoginRequest(request, env);
      } else if (url.pathname === "/") {
        return handleRegistrationRequest(request, env);
      } else if (url.pathname === "/api/events") {
        return handleCreateEvent(request, env);
      } else if (url.pathname === "/user/update") {
        return handleUserUpdate(request, env);
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } else if (request.method === "GET") {
      // Handle GET requests
      if (url.pathname === "/user/stats") {

        return handleUserStats(request, env);

      } else {
        return new Response("Not Found", { status: 404 });
      }
    } else if (request.method === "DELETE") {
      // Handle DELETE requests
      if (url.pathname.startsWith("/api/events/")) {
        return handleDeleteEvent(request, env);
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } else {
      return new Response("Method Not Allowed", { status: 405 });
    }
  },
};

async function handleUserUpdate(request, env) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const token = authHeader.slice(7);
  let userId;

  try {
    userId = await getUserIdFromToken(token, env);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const body = await request.json();
  const { name, email, phone, role } = body;

  if (!name || !email || !phone || !role) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    await env.DB.prepare(`
      UPDATE users
      SET name = ?, email = ?, phone = ?, role = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(name, email, phone, role, userId).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Failed to update user:", err);
    console.error("Failed to update user backup:", err.message, err.stack);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}


function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Initialize database tables if they don't exist
async function initializeDatabase(env) {
  try {
    const db = getDatabase(env);
    
    // Create events table with consistent column naming
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
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to verify token and get user
function verifyToken(token) {
  try {
    // Your current token is base64 encoded user data
    const userData = JSON.parse(atob(token));
    return userData;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// NEW: Handle user stats endpoint
async function handleUserStats(request, env) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }

  const token = authHeader.slice(7);
  let userId;

  try {
    // Replace with your actual token logic
    userId = await getUserIdFromToken(token, env);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }

  try {
    console.log("Stats lookup for userId:", userId);
    
    const result = await env.DB.prepare(`
      SELECT 
        name,
        login_count AS loginCount,
        last_login AS lastLogin,
        created_at AS memberSince,
        (SELECT COUNT(*) FROM profile_views WHERE viewed_user_id = ?) AS profileViews
      FROM users 
      WHERE id = ?
    `).bind(userId, userId).first();

    console.log("Stats DB result:", result);

    if (!result) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }

    return new Response(JSON.stringify({
      loginCount: result.loginCount || 0,
      lastLogin: result.lastLogin || null,
      memberSince: result.memberSince || null,
      profileViews: result.profileViews || 0,
      name: result.name || null
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  } catch (err) {
    console.error("Worker DB error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
}

// Placeholder - update with real logic
async function getUserIdFromToken(token, env) {
  try {
    const userData = JSON.parse(atob(token));

    // Optional: validate against DB that session is legit
    const session = await env.DB.prepare(`
      SELECT user_id FROM user_sessions WHERE token = ?
    `).bind(token).first();

    if (!session || session.user_id !== userData.id) {
      throw new Error("Invalid session");
    }

    return userData.id;
  } catch (err) {
    console.error("Failed to decode token or validate session:", err);
    throw new Error("Invalid token");
  }
}

// Registration handler (using production DB for users)
async function handleRegistrationRequest(request, env) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role } = body;

    if (!name || !email || !phone || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const sql = `INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?)`;
    const result = await env.DB.prepare(sql).bind(name, email, phone, password, role).run();

    return new Response(
      JSON.stringify({ success: true, id: result.meta.last_row_id }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// Login handler (using production DB for users) - UPDATED to track sessions
async function handleLoginRequest(request, env) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await env.DB.prepare(sql).bind(email).first();

    if (!result) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (result.password !== password) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const userData = {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      role: result.role
    };

    const token = btoa(JSON.stringify(userData));
    //const token = Buffer.from(JSON.stringify(userData)).toString('base64');
    console.log("Your token is:", token);
    // Initialize database tables first
    await initializeDatabase(env);

    // Track this login session
    try {
      await env.DB.prepare(`
        INSERT INTO user_sessions (user_id, token) VALUES (?, ?)
      `).bind(result.id, token).run();

      // Update user's last login time
      await env.DB.prepare(`
        UPDATE users 
        SET 
          last_login = datetime('now'),
          login_count = COALESCE(login_count, 0) + 1,
          updated_at = datetime('now')
        WHERE id = ?
      `).bind(result.id).run();
    } catch (sessionError) {
      console.error('Error tracking login session:', sessionError);
      // Don't fail the login if session tracking fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData,
        token: token
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// Get all events (using appropriate database)
async function handleGetEvents(request, env) {
  try {
    // Initialize database first
    await initializeDatabase(env);
    
    const db = getDatabase(env);
    const sql = `SELECT id, title, description, location, startTime, endTime, created_at FROM events ORDER BY startTime`;
    const result = await db.prepare(sql).all();

    return new Response(
      JSON.stringify({
        success: true,
        events: result.results || []
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Get events error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// Create a new event (using appropriate database)
async function handleCreateEvent(request, env) {
  try {
    // Initialize database first
    await initializeDatabase(env);
    
    const body = await request.json();
    const { title, description, location, startTime, endTime } = body;

    console.log("Received event data:", { title, description, location, startTime, endTime });

    // Validate required fields
    if (!title || !description || !location || !startTime || !endTime) {
      return new Response(JSON.stringify({ 
        error: "All fields are required (title, description, location, startTime, endTime)" 
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Validate time
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return new Response(JSON.stringify({ 
        error: "Invalid date format for startTime or endTime" 
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    
    if (end <= start) {
      return new Response(JSON.stringify({ 
        error: "End time must be after start time" 
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const db = getDatabase(env);
    console.log("Using database:", db ? "Connected" : "Not connected");
    
    // Use consistent column naming
    const sql = `INSERT INTO events (title, description, location, startTime, endTime, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
    const result = await db.prepare(sql).bind(title, description, location, startTime, endTime).run();

    console.log("Database insert result:", result);

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Event created successfully", 
          id: result.meta.last_row_id 
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Failed to create event in database" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (err) {
    console.error("Create event error:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error: " + err.message 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// Delete an event (using appropriate database)
async function handleDeleteEvent(request, env) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const eventId = pathParts[pathParts.length - 1];

    if (!eventId || isNaN(eventId)) {
      return new Response(JSON.stringify({ error: "Invalid event ID" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const db = getDatabase(env);
    
    // First check if the event exists
    const checkSql = `SELECT id FROM events WHERE id = ?`;
    const existingEvent = await db.prepare(checkSql).bind(eventId).first();
    
    if (!existingEvent) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
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
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Failed to delete event" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (err) {
    console.error("Delete event error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}