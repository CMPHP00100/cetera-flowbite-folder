-- Drop backup table if exists
DROP TABLE IF EXISTS users_backup;

-- Backup existing data
CREATE TABLE users_backup AS SELECT id, name, email, phone, password, role, created_at, updated_at FROM users;

-- Drop old table
DROP TABLE users;

-- Create new schema
CREATE TABLE users (
    id TEXT PRIMARY KEY,
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

-- Restore known-good columns
INSERT INTO users (id, name, email, phone, password, role, created_at, updated_at)
SELECT id, name, email, phone, password, role, created_at, updated_at
FROM users_backup;

-- Drop backup
DROP TABLE users_backup;
