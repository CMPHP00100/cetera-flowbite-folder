-- Backup existing users
DROP TABLE IF EXISTS users_backup;
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop the old users table
DROP TABLE users;

-- Recreate the users table with only END_USER and PREMIUM_USER roles
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

-- Restore data from backup
INSERT INTO users (name, email, phone, password, role, login_count, last_login, created_at, updated_at, access_code)
SELECT name, email, phone, password,
       CASE 
           WHEN role = 'PREMIUM_USER' THEN 'PREMIUM_USER'
           ELSE 'END_USER'
       END AS role,
       COALESCE(login_count, 0), last_login, created_at, updated_at, access_code
FROM users_backup;

-- Clean up backup
DROP TABLE users_backup;
