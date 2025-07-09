-- For tracking login sessions
CREATE TABLE user_sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- For tracking profile views (optional)
CREATE TABLE profile_views (
  id INTEGER PRIMARY KEY,
  viewer_id INTEGER,
  viewed_user_id INTEGER,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viewer_id) REFERENCES users(id),
  FOREIGN KEY (viewed_user_id) REFERENCES users(id)
);