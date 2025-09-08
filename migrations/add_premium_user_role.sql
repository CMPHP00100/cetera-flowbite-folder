-- 1️⃣ Create a new temporary table with the updated role constraint
CREATE TABLE users_new (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT CHECK(role IN (
        'GLOBAL_ADMIN', 'GLOBAL_SUPPORT',
        'PROVIDER_ADMIN', 'PROVIDER_SUPPORT',
        'SUPPLIER_ADMIN', 'SUPPLIER_SUPPORT',
        'CLIENT_ADMIN', 'CLIENT_SUPPORT',
        'END_USER', 'PREMIUM_USER'
    )),
    access_code TEXT,
    -- include all other columns from your original users table here
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 2️⃣ Copy all existing data to the new table
INSERT INTO users_new (id, name, email, role, access_code, created_at, updated_at)
SELECT id, name, email, role, access_code, created_at, updated_at
FROM users;

-- 3️⃣ Drop the old table
DROP TABLE users;

-- 4️⃣ Rename the new table to the original name
ALTER TABLE users_new RENAME TO users;
