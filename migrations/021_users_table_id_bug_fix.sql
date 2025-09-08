-- Backup existing data if any users exist
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop the existing table
DROP TABLE users;

-- Recreate users table with plain TEXT primary key (UUIDs must be provided by app or insert logic)
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

-- Restore any existing data (preserve original IDs if they existed)
INSERT INTO users (id, name, email, phone, password, role, login_count, last_login, created_at, updated_at, access_code)
SELECT id, name, email, phone, password, role,
       COALESCE(login_count, 0), last_login, created_at, updated_at, access_code
FROM users_backup;

-- Clean up
DROP TABLE users_backup;
