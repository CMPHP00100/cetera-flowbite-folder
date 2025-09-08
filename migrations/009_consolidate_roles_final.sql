-- Update all roles to either STANDARD_USER or PREMIUM_USER
UPDATE users
SET role = CASE
    WHEN role = 'PREMIUM_USER' THEN 'PREMIUM_USER'
    ELSE 'STANDARD_USER'
END;

-- Drop the old users table and recreate with new role constraint safely
PRAGMA foreign_keys = OFF;

ALTER TABLE users RENAME TO users_old;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('STANDARD_USER','PREMIUM_USER')) DEFAULT 'STANDARD_USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  access_code TEXT
);

INSERT INTO users (id, name, email, password, role, created_at, updated_at, access_code)
SELECT id, name, email, password, role, created_at, updated_at, access_code
FROM users_old;

DROP TABLE users_old;

PRAGMA foreign_keys = ON;
