-- 1. Rename old table
ALTER TABLE users RENAME TO users_old;

-- 2. Create new table without `roles` column
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (
    role IN (
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
    )
  ),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Copy data from old to new
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
SELECT id, name, email, password, role, created_at, updated_at
FROM users_old;

-- 4. Drop old table
DROP TABLE users_old;
