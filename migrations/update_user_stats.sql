SELECT 
  login_count AS loginCount,
  last_login AS lastLogin,
  created_at AS memberSince,
  (SELECT COUNT(*) FROM profile_views WHERE viewed_user_id = ?) AS profileViews
FROM users 
WHERE id = ?