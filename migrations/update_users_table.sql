-- Add new columns to the users table
ALTER TABLE users
ADD COLUMN login_count INTEGER DEFAULT 0;

ALTER TABLE users
ADD COLUMN last_login DATETIME;

-- Create a trigger to update login stats
CREATE TRIGGER update_login_stats
AFTER UPDATE ON users
FOR EACH ROW
WHEN NEW.last_login IS NOT NULL AND OLD.last_login != NEW.last_login
BEGIN
    UPDATE users
    SET 
        login_count = COALESCE(NEW.login_count, 0) + 1, -- Safeguard against null values
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
