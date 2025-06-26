// src/index.js - Updated Cloudflare Worker

// Helper function to get the appropriate database
function getDatabase(env) {
  // Use development database for local development
  // Use production database for deployed worker
  console.log('Available env bindings:', Object.keys(env));
  console.log('DB_DEV available:', !!env.DB_DEV);
  console.log('DB available:', !!env.DB);
  
  const db = env.DB_DEV || env.DB;
  console.log('Using database:', db === env.DB_DEV ? 'DB_DEV' : 'DB');
  return db;
}

export default {
  async fetch(request, env) {
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
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } else if (request.method === "GET") {
      // Handle GET requests
      if (url.pathname === "/api/events") {
        return handleGetEvents(request, env);
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
    
    console.log('Events table initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Registration handler (using production DB for users)
async function handleRegistrationRequest(request, env) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    const result = await env.DB.prepare(sql).bind(name, email, password, role).run();

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

// Login handler (using production DB for users)
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
      role: result.role
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData,
        token: btoa(JSON.stringify(userData))
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