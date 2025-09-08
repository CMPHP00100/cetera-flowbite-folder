-- migrations/005_reset_roles_column_fixed.sql

PRAGMA foreign_keys=off;

-- 0️⃣ Drop dependent views first
DROP VIEW IF EXISTS user_summary;

-- 1️⃣ Rename old users table
ALTER TABLE users RENAME TO users_old;

-- 2️⃣ Create new users table with only STANDARD_USER / PREMIUM_USER roles
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('STANDARD_USER','PREMIUM_USER')) DEFAULT 'STANDARD_USER',
    access_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME
);

-- 3️⃣ Migrate data (exclude phone since old table doesn't have it)
INSERT INTO users (id, name, email, password, role, access_code, created_at, updated_at, login_count, last_login)
SELECT
    id,
    name,
    email,
    password,
    CASE
        WHEN role IN ('PREMIUM_USER', 'CLIENT_ADMIN', 'SUPPLIER_ADMIN', 'PROVIDER_ADMIN') THEN 'PREMIUM_USER'
        ELSE 'STANDARD_USER'
    END AS role,
    access_code,
    created_at,
    updated_at,
    login_count,
    last_login
FROM users_old;

-- 4️⃣ Drop old table
DROP TABLE users_old;

-- 5️⃣ Recreate the view with correct references
CREATE VIEW user_summary AS
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    CASE WHEN u.role = 'PREMIUM_USER' THEN 1 ELSE 0 END AS is_premium,
    COALESCE(pa.count, 0) AS premium_access_count,
    COALESCE(lg.count, 0) AS login_count,
    COALESCE(pv.count, 0) AS profile_views_count,
    COALESCE(us.count, 0) AS active_sessions_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM premium_access GROUP BY user_id
) pa ON pa.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM logins GROUP BY user_id
) lg ON lg.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM profile_views GROUP BY user_id
) pv ON pv.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM user_sessions GROUP BY user_id
) us ON us.user_id = u.id;

PRAGMA foreign_keys=on;
