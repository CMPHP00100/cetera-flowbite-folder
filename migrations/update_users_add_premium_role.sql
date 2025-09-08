-- 1️⃣ Drop the view first so we can safely modify the users table
DROP VIEW IF EXISTS user_summary;

-- 2️⃣ Create a new users table with the PREMIUM_USER role added
CREATE TABLE IF NOT EXISTS users_new (
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

-- 3️⃣ Copy existing users into the new table
INSERT INTO users_new (id, name, email, password, role, created_at)
SELECT id, name, email, password, role, created_at FROM users;

-- 4️⃣ Drop the old users table and rename the new one
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- 5️⃣ Recreate the user_summary view
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
