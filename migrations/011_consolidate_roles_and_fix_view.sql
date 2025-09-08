PRAGMA foreign_keys = OFF;

-- 1. Rename existing users table
ALTER TABLE users RENAME TO users_old;

-- 2. Recreate users table with only STANDARD_USER and PREMIUM_USER roles
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('STANDARD_USER', 'PREMIUM_USER')) DEFAULT 'STANDARD_USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME,
    phone TEXT,
    access_code TEXT
);

-- 3. Copy data from old table, mapping roles
INSERT INTO users (
    id, name, email, password, role,
    created_at, updated_at, login_count, last_login, phone, access_code
)
SELECT
    id, name, email, password,
    CASE
        WHEN role IN ('CLIENT_ADMIN', 'SUPPLIER_ADMIN', 'PROVIDER_ADMIN', 'PREMIUM_USER') THEN 'PREMIUM_USER'
        ELSE 'STANDARD_USER'
    END,
    created_at, updated_at, login_count, last_login, phone, access_code
FROM users_old;

-- 4. Drop old table
DROP TABLE users_old;

-- 5. Drop broken view if it exists
DROP VIEW IF EXISTS user_summary;

-- 6. Recreate the view with updated users table
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

PRAGMA foreign_keys = ON;
