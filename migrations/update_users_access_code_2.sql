PRAGMA foreign_keys = OFF;

-- Backup old table
ALTER TABLE users RENAME TO users_old;

-- Create new users table with access_code
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' ||
    substr(lower(hex(randomblob(2))),2) || '-' ||
    substr('89ab',abs(random()) % 4 + 1, 1) ||
    substr(lower(hex(randomblob(2))),2) || '-' ||
    lower(hex(randomblob(6)))),
  name TEXT,
  email TEXT,
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
  access_code TEXT, -- ✅ new column for access code
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  last_login DATETIME,
  phone TEXT
);

-- Migrate data (keep old values, access_code will be NULL initially)
INSERT INTO users (
  id, name, email, password, role, created_at,
  updated_at, login_count, last_login, phone
)
SELECT
  id, name, email, password, role, created_at,
  updated_at, login_count, last_login, phone
FROM users_old;

-- Drop backup
DROP TABLE users_old;

PRAGMA foreign_keys = ON;
