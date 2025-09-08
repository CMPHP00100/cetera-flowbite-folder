PRAGMA foreign_keys = OFF;

-- 1. Rename current table
ALTER TABLE users RENAME TO users_old;

-- 2. Create new users table with only STANDARD_USER and PREMIUM_USER
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' ||
        substr(lower(hex(randomblob(2))),2) || '-' ||
        substr('89ab',abs(random()) % 4 + 1, 1) ||
        substr(lower(hex(randomblob(2))),2) || '-' ||
        lower(hex(randomblob(6)))),
    name TEXT,
    email TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('STANDARD_USER','PREMIUM_USER')) DEFAULT 'STANDARD_USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME,
    phone TEXT,
    access_code TEXT
);

-- 3. Copy data, mapping old roles
INSERT INTO users (id, name, email, password, role, created_at, updated_at, login_count, last_login, phone, access_code)
SELECT
    id,
    name,
    email,
    password,
    CASE WHEN role = 'PREMIUM_USER' THEN 'PREMIUM_USER' ELSE 'STANDARD_USER' END,
    created_at,
    updated_at,
    COALESCE(login_count, 0),
    last_login,
    phone,
    access_code
FROM users_old;

-- 4. Drop old table
DROP TABLE users_old;

-- 5. Recreate user_summary view using the correct column references
DROP VIEW IF EXISTS user_summary;

CREATE VIEW user_summary AS
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    CASE WHEN u.role = 'PREMIUM_USER' THEN 1 ELSE 0 END AS is_premium,
    COALESCE(pa.count, 0) AS premium_access_count,
    COALESCE(u.login_count, 0) AS login_count,
    COALESCE(pv.count, 0) AS profile_views_count,
    COALESCE(us.count, 0) AS active_sessions_count
FROM users u
LEFT JOIN (SELECT user_id, COUNT(*) AS count FROM premium_access GROUP BY user_id) pa
    ON pa.user_id = u.id
LEFT JOIN (SELECT user_id, COUNT(*) AS count FROM profile_views GROUP BY user_id) pv
    ON pv.user_id = u.id
LEFT JOIN (SELECT user_id, COUNT(*) AS count FROM user_sessions GROUP BY user_id) us
    ON us.user_id = u.id;

PRAGMA foreign_keys = ON;
