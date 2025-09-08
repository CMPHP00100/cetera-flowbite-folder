PRAGMA foreign_keys = OFF;

-- Drop the view first
DROP VIEW IF EXISTS user_summary;

-- Rename current users table
ALTER TABLE users RENAME TO users_old;

-- Create new users table with only allowed roles
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' ||
        substr(lower(hex(randomblob(2))),2) || '-' ||
        substr('89ab',abs(random()) % 4 + 1, 1) ||
        substr(lower(hex(randomblob(2))),2) || '-' ||
        lower(hex(randomblob(6)))),
    name TEXT,
    email TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN (
        'STANDARD_USER',
        'PREMIUM_USER'
    )) DEFAULT 'STANDARD_USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME,
    phone TEXT,
    access_code TEXT
);

-- Copy existing users, mapping roles to allowed values
INSERT INTO users (id, name, email, password, role, created_at, updated_at, login_count, last_login, phone, access_code)
SELECT
    id,
    name,
    email,
    password,
    CASE 
        WHEN role='PREMIUM_USER' THEN 'PREMIUM_USER'
        ELSE 'STANDARD_USER'
    END AS role,
    created_at,
    updated_at,
    login_count,
    last_login,
    phone,
    access_code
FROM users_old;

-- Drop old table
DROP TABLE users_old;

-- Recreate the user_summary view
CREATE VIEW user_summary AS
SELECT
    id AS user_id,
    name,
    email,
    role,
    CASE WHEN role='PREMIUM_USER' THEN 1 ELSE 0 END AS is_premium,
    COALESCE(pa.count,0) AS premium_access_count,
    COALESCE(login_count,0) AS login_count,
    COALESCE(pv.count,0) AS profile_views_count,
    COALESCE(us.count,0) AS active_sessions_count
FROM users
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count
    FROM premium_access
    GROUP BY user_id
) pa ON pa.user_id = users.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count
    FROM profile_views
    GROUP BY user_id
) pv ON pv.user_id = users.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count
    FROM user_sessions
    GROUP BY user_id
) us ON us.user_id = users.id;

PRAGMA foreign_keys = ON;
