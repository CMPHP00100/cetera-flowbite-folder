-- Check migration worked
SELECT id, role, access_code FROM users LIMIT 5;

-- Verify premium_access table exists
SELECT name FROM sqlite_master WHERE type='table' AND name='premium_access';

-- Test constraints work
SELECT * FROM pragma_foreign_key_list('premium_access');