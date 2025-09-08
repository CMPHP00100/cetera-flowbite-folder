-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Users table with access_code and premium roles
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

-- Track login history
CREATE TABLE IF NOT EXISTS logins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Track profile views
CREATE TABLE IF NOT EXISTS profile_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Events table
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

-- Premium access table
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
