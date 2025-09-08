-- Add phone column to existing users table
ALTER TABLE users ADD COLUMN phone TEXT;

-- Optional: Set a default value for existing users
UPDATE users SET phone = 'N/A' WHERE phone IS NULL;

-- Verify the change
PRAGMA table_info(users);