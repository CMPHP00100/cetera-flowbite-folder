-- migrations/upgrade_roles.sql

-- Ensure premium_access table exists
CREATE TABLE IF NOT EXISTS premium_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  access_code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Upgrade roles for users with matching premium_access entries
UPDATE users
SET role = 'PREMIUM_USER'
WHERE id IN (
  SELECT user_id FROM premium_access
);
