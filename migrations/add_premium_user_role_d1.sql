-- migrations/add_premium_user_role_d1.sql (D1-safe version)

-- 1. Create a new users table with PREMIUM_USER allowed
CREATE TABLE users_new (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Copy all existing data from old users table
INSERT INTO users_new (id, name, email, password, role, created_at)
SELECT id, name, email, password, role, created_at FROM users;

-- 3. Drop the old users table
DROP TABLE users;

-- 4. Rename new table to users
ALTER TABLE users_new RENAME TO users;
