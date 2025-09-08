-- 1️⃣ Update existing roles to only STANDARD_USER or PREMIUM_USER
UPDATE users
SET role = CASE
    WHEN role IN ('CLIENT_ADMIN', 'SUPPLIER_ADMIN', 'PROVIDER_ADMIN', 'PREMIUM_USER') THEN 'PREMIUM_USER'
    ELSE 'STANDARD_USER'
END;

-- 2️⃣ Rename old table
ALTER TABLE users RENAME TO users_old;

-- 3️⃣ Create new users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT,
    role TEXT DEFAULT 'STANDARD_USER',
    access_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ Migrate data from old table
INSERT INTO users (id, name, email, phone, password, role, access_code, created_at, updated_at)
SELECT id, name, email, phone, password, role, access_code, created_at, updated_at
FROM users_old;

-- 5️⃣ Drop old table
DROP TABLE users_old;
