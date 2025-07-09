CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  login_count INTEGER DEFAULT 0,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

INSERT INTO users_new (
  id, name, email, password, role,
  login_count, last_login, created_at, updated_at
)
SELECT 
  id, name, email, password, role,
  login_count, last_login, created_at, updated_at
FROM users;

DROP TABLE users;

ALTER TABLE users_new RENAME TO users;
