-- Ensure subscriptions table exists
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  access_code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Commented out since role column already exists
-- ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'CLIENT_USER';
