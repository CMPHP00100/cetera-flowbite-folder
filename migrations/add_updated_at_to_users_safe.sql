-- Add updated_at column if it doesn't exist
PRAGMA writable_schema = 1;
-- Check if column exists
SELECT COUNT(*) AS col_exists 
FROM pragma_table_info('users') 
WHERE name='updated_at';
PRAGMA writable_schema = 0;

-- Add the column
ALTER TABLE users ADD COLUMN updated_at DATETIME;

-- Backfill existing rows
UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;

-- Trigger already exists; no action needed for it
