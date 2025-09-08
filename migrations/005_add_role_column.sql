-- migrations/005_update_role_column.sql

-- 1️⃣ Convert any current role values to STANDARD_USER / PREMIUM_USER
UPDATE users
SET role = CASE
    WHEN role = 'PREMIUM_USER' OR role = 'CLIENT_ADMIN' THEN 'PREMIUM_USER'
    ELSE 'STANDARD_USER'
END;

-- 2️⃣ Remove any old constraints by recreating the table
PRAGMA foreign_keys=off;

ALTER TABLE users RENAME TO users_old;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('STANDARD_USER','PREMIUM_USER')) DEFAULT 'STANDARD_USER',
    access_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME
);

INSERT INTO users (id, name, email, password, phone, role, access_code, created_at, updated_at, login_count, last_login)
SELECT id, name, email, password, phone, role, access_code, created_at, updated_at, login_count, last_login
FROM users_old;

DROP TABLE users_old;

PRAGMA foreign_keys=on;
