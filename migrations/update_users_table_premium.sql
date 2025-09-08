PRAGMA foreign_keys = OFF;

-- Rename old table
ALTER TABLE users RENAME TO users_old;

-- Recreate users table without the old constraint
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
    'STANDARD_USER',
    'PREMIUM_USER'
  )) DEFAULT 'STANDARD_USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  last_login DATETIME,
  phone TEXT
);

-- Copy data from old table, but reset role to STANDARD_USER by default
INSERT INTO users (
  id, name, email, password, role,
  created_at, updated_at, login_count, last_login, phone
)
SELECT
  id, name, email, password, 'STANDARD_USER',
  created_at, updated_at, login_count, last_login, phone
FROM users_old;

-- Drop old table
DROP TABLE users_old;

PRAGMA foreign_keys = ON;
