PRAGMA foreign_keys = OFF;

-- Step 1: Rename the existing table
ALTER TABLE users RENAME TO users_old;

-- Step 2: Create a new users table with only STANDARD_USER and PREMIUM_USER allowed
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

-- Step 3: Insert data from old table, converting roles to STANDARD_USER/PREMIUM_USER
INSERT INTO users (id, name, email, password, role, created_at, updated_at, access_code)
SELECT 
    id, 
    name, 
    email, 
    password,
    CASE 
        WHEN role = 'PREMIUM_USER' THEN 'PREMIUM_USER'
        ELSE 'STANDARD_USER'
    END AS role,
    created_at, 
    updated_at, 
    access_code
FROM users_old;

-- Step 4: Drop old table
DROP TABLE users_old;

PRAGMA foreign_keys = ON;
