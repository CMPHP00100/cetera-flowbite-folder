PRAGMA foreign_keys = OFF;

-- 1️⃣ Rename old table
ALTER TABLE users RENAME TO users_old;

-- 2️⃣ Create new table with only STANDARD_USER / PREMIUM_USER roles
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT NOT NULL CHECK(role IN ('STANDARD_USER', 'PREMIUM_USER')) DEFAULT 'STANDARD_USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  access_code TEXT,
  updated_at DATETIME
);

-- 3️⃣ Copy data from old table, mapping old roles to new roles
INSERT INTO users (id, name, email, password, role, created_at, access_code, updated_at)
SELECT
  id,
  name,
  email,
  password,
  CASE 
    WHEN role IN ('CLIENT_ADMIN','SUPPLIER_ADMIN','PROVIDER_ADMIN','PREMIUM_USER') THEN 'PREMIUM_USER'
    ELSE 'STANDARD_USER'
  END AS role,
  created_at,
  access_code,
  updated_at
FROM users_old;

-- 4️⃣ Drop old table
DROP TABLE users_old;

PRAGMA foreign_keys = ON;
