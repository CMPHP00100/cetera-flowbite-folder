-- migrations/add_updated_at_to_users_d1.sql

-- 1️⃣ Add the updated_at column (allow NULLs)
ALTER TABLE users ADD COLUMN updated_at DATETIME;

-- 2️⃣ Backfill existing rows with current timestamp
UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;

-- 3️⃣ Create trigger to auto-update updated_at on row update
CREATE TRIGGER update_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
