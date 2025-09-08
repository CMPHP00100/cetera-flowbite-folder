// lib/database.js
//import { DB as D1Binding } from './d1Local';
let Database;

if (process.env.NODE_ENV === "development" && typeof window === "undefined") {
  try {
    Database = require("better-sqlite3");
    console.log("✅ better-sqlite3 loaded successfully");
  } catch (error) {
    console.log("❌ better-sqlite3 not available:", error.message);
  }
}

class DatabaseWrapper {
  constructor(db) {
    this.db = db;
    this.isD1 = !!(db && db.prepare && db.batch); // D1 detection
    this.isSQLite = !this.isD1 && !!db;
  }

  prepare(query) {
    if (this.isD1) {
      return this.db.prepare(query);
    }
    if (this.isSQLite) {
      const stmt = this.db.prepare(query);
      return {
        bind: (...params) => ({
          first: () => stmt.get(...params),
          all: () => stmt.all(...params),
          run: () => {
            const result = stmt.run(...params);
            return {
              success: true,
              meta: {
                last_row_id: result.lastInsertRowid,
                changes: result.changes,
              },
            };
          },
        }),
      };
    }
    throw new Error("No database available");
  }

  // Example helpers
  createEvent({ title, description, location, startTime, endTime }) {
    const query = `
      INSERT INTO events (title, description, location, startTime, endTime)
      VALUES (?, ?, ?, ?, ?)
    `;
    return this.prepare(query)
      .bind(title, description, location, startTime, endTime)
      .run();
  }

  fetchEvents() {
    const query = "SELECT * FROM events ORDER BY startTime ASC";
    return this.prepare(query).bind().all();
  }
}

/*export function getDatabase(env = process.env) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && env?.DB) {
    console.log("Using D1 database (Production)");
    return new DatabaseWrapper(env.DB);
  }

  if (!isProduction) {
    if (!Database) {
      throw new Error(
        "Database not available. Install better-sqlite3 for development."
      );
    }
    const dbPath = env.DB_PATH || "local.db";
    const db = new Database(dbPath);

    // Enable WAL mode for better performance
    db.pragma("journal_mode = WAL");

    initializeSQLite(db);
    return new DatabaseWrapper(db);
  }

  throw new Error("No database configuration available");
}*/
/*export function getDatabase(env = process.env) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && globalThis.env?.DB) {
    console.log("⚡ Using D1 database (Production)");
    return new DatabaseWrapper(globalThis.env.DB);
  }

  if (!isProduction) {
    if (!Database) {
      throw new Error("❌ better-sqlite3 not available in dev");
    }
    const dbPath = env.DB_PATH || "dev.db";
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    initializeSQLite(db);
    return new DatabaseWrapper(db);
  }

  throw new Error("❌ No database configuration available");
}*/
export function getDatabase(env) {
  const isProduction = process.env.NODE_ENV === "production";

  // --- Production (Cloudflare D1) ---
  if (isProduction && env?.DB) {
    console.log("⚡ Using Cloudflare D1 database");
    return new DatabaseWrapper(env.DB);
  }

  // --- Development (better-sqlite3) ---
  if (!isProduction) {
    if (!Database) {
      throw new Error("❌ better-sqlite3 not available in dev");
    }
    const dbPath = env?.DB_PATH || "dev.db";
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    initializeSQLite(db);
    return new DatabaseWrapper(db);
  }

  throw new Error("❌ No database configuration available");
}

function initializeSQLite(db) {
  // Create base schema (new users with access_code + premium roles)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN (
        'GLOBAL_ADMIN',
        'GLOBAL_SUPPORT',
        'PROVIDER_ADMIN',
        'PROVIDER_SUPPORT',
        'SUPPLIER_ADMIN',
        'SUPPLIER_SUPPORT',
        'CLIENT_ADMIN',
        'CLIENT_SUPPORT',
        'END_USER',
        'PREMIUM_USER'
      )) DEFAULT 'END_USER',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      login_count INTEGER DEFAULT 0,
      last_login DATETIME,
      phone TEXT,
      image TEXT,
      access_code TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS logins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS profile_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS premium_access (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      access_code TEXT NOT NULL,
      granted_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (granted_by) REFERENCES users (id),
      UNIQUE(user_id, access_code)
    );
  `);

  // Schema migration check: ensure access_code exists
  try {
    const columns = db.prepare("PRAGMA table_info(users)").all();
    const columnNames = columns.map((col) => col.name);

    if (!columnNames.includes("access_code")) {
      db.exec("ALTER TABLE users ADD COLUMN access_code TEXT");
      db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_access_code ON users(access_code);");
      console.log("✅ Added access_code column with unique index");
    }
  } catch (error) {
    console.log("Schema migration check error:", error.message);
  }

  console.log("✅ SQLite database initialized with premium roles + access_code");
}

// Helper function to generate unique access codes
export function generateAccessCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper to execute a statement and return the number of affected rows
export async function runStmt(stmt, ...params) {
  try {
    console.log("💻 Executing statement:", stmt?.text || stmt, "Params:", params);
    if (stmt.run) return stmt.run(...params)?.changes ?? 0;
    if (stmt.bind) return (await stmt.bind(...params).run())?.meta?.changes ?? 0;
    if (stmt.execute) return (await stmt.execute(...params))?.changes ?? 0;
    throw new Error("Unsupported statement type for runStmt");
  } catch (error) {
    console.error("Database execution error:", error);
    throw error;
  }
}

// Helper to execute a query and return results
export async function queryStmt(stmt, ...params) {
  try {
    console.log("🔍 Querying:", stmt?.text || stmt, "Params:", params);
    if (stmt.get) return stmt.get(...params);
    if (stmt.all) return stmt.all(...params)?.[0] ?? null;
    if (stmt.bind) {
      if (typeof stmt.bind().first === "function") {
        return await stmt.bind(...params).first();
      }
      const res = await stmt.bind(...params).all();
      return res?.results?.[0] ?? null;
    }
    if (stmt.execute) return (await stmt.execute(...params))?.rows?.[0] ?? null;
    throw new Error("Unsupported statement type for queryStmt");
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
