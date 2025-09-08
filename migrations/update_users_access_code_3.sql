-- Database Diagnostic Script
-- Run this first to see what already exists

-- 1️⃣ Show all tables
SELECT 
  'Existing tables:' as info,
  name as table_name,
  type
FROM sqlite_master 
WHERE type = 'table' 
ORDER BY name;

-- 2️⃣ Show users table structure
PRAGMA table_info(users);

-- 3️⃣ Check if premium_access table exists and show its structure
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='premium_access')
    THEN 'premium_access table EXISTS'
    ELSE 'premium_access table DOES NOT EXIST'
  END as premium_access_status;

-- If premium_access exists, show its structure
-- PRAGMA table_info(premium_access); -- Uncomment if table exists

-- 4️⃣ Check if access_code column exists in users table
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pragma_table_info('users') 
      WHERE name = 'access_code'
    )
    THEN 'access_code column EXISTS in users table'
    ELSE 'access_code column DOES NOT EXIST in users table'
  END as access_code_status;

-- 5️⃣ Show sample users data
SELECT 
  'Sample users:' as info,
  id,
  role,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pragma_table_info('users') WHERE name = 'access_code')
    THEN 'Column exists - check actual data'
    ELSE 'Column does not exist'
  END as access_code_info
FROM users 
LIMIT 3;

-- 6️⃣ Show all indexes
SELECT 
  'Existing indexes:' as info,
  name as index_name,
  tbl_name as table_name
FROM sqlite_master 
WHERE type = 'index' AND tbl_name IN ('users', 'premium_access')
ORDER BY tbl_name, name;