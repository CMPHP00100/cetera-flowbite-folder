let Database;

if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  try {
    Database = require('better-sqlite3');
    console.log('✅ better-sqlite3 loaded successfully');
  } catch (error) {
    console.log('❌ better-sqlite3 not available:', error.message);
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
    throw new Error('No database available');
  }

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

export function getDatabase(env) {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && env?.DB) {
    console.log('Using D1 database (Production)');
    return new DatabaseWrapper(env.DB);
  }

  if (!isProduction) {
    if (!Database) {
      throw new Error('Database not available. Install better-sqlite3 for development.');
    }
    const db = new Database('local.db');
    initializeSQLite(db);
    return new DatabaseWrapper(db);
  }

  throw new Error('No database configuration available');
}

function initializeSQLite(db) {
  db.exec(`
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
  `);
  console.log('✅ SQLite database initialized');
}
