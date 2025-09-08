-- Disable foreign keys temporarily
PRAGMA foreign_keys = OFF;

-- Rename the old users table
ALTER TABLE users RENAME TO users_old;

-- Create the new users table with only STANDARD_USER and PREMIUM_USER roles
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('STANDARD_USER','PREMIUM_USER')) DEFAULT 'STANDARD_USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  last_login DATETIME,
  phone TEXT,
  access_code TEXT
);

-- Copy all existing users, converting old roles to the new allowed roles
INSERT INTO users (id, name, email, password, role, created_at, updated_at, login_count, last_login, phone, access_code)
SELECT
  id, name, email, password,
  CASE 
    WHEN role IN ('CLIENT_ADMIN', 'SUPPLIER_ADMIN', 'PROVIDER_ADMIN', 'PREMIUM_USER') THEN 'PREMIUM_USER'
    ELSE 'STANDARD_USER'
  END,
  created_at, updated_at, login_count, last_login, phone, access_code
FROM users_old;

-- Drop the old users table
DROP TABLE users_old;

-- Re-enable foreign keys
PRAGMA foreign_keys = ON;
