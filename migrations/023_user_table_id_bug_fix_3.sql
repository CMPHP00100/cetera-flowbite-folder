-- Backup existing data
DROP TABLE IF EXISTS users_backup;
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop old table
DROP TABLE users;

-- Create new schema with auto-increment IDs
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'END_USER' CHECK (
        role IN (
            'GLOBAL_ADMIN', 'GLOBAL_SUPPORT',
            'PROVIDER_ADMIN', 'PROVIDER_SUPPORT',
            'SUPPLIER_ADMIN', 'SUPPLIER_SUPPORT',
            'CLIENT_ADMIN', 'CLIENT_SUPPORT',
            'END_USER', 'PREMIUM_USER'
        )
    ),
    access_code TEXT,
    login_count INTEGER DEFAULT 0,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Restore data (ignore old IDs, let SQLite assign new ones)
INSERT INTO users (name, email, phone, password, role, login_count, last_login, created_at, updated_at, access_code)
SELECT name, email, phone, password, role,
       COALESCE(login_count, 0), last_login, created_at, updated_at, access_code
FROM users_backup;

-- Clean up
DROP TABLE users_backup;
