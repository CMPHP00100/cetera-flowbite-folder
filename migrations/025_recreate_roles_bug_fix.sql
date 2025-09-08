-- Drop old table if it exists
DROP TABLE IF EXISTS users;

-- Create new users table with only END_USER and PREMIUM_USER roles
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'END_USER' CHECK (
        role IN ('END_USER', 'PREMIUM_USER')
    ),
    access_code TEXT,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
