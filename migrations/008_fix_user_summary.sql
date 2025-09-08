-- Drop the old view if it exists
DROP VIEW IF EXISTS user_summary;

-- Recreate the view with the new users table
CREATE VIEW user_summary AS
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    CASE WHEN u.role = 'PREMIUM_USER' THEN 1 ELSE 0 END AS is_premium,
    COALESCE(pa.count, 0) AS premium_access_count,
    COALESCE(lg.count, 0) AS login_count,
    COALESCE(pv.count, 0) AS profile_views_count,
    COALESCE(us.count, 0) AS active_sessions_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM premium_access GROUP BY user_id
) pa ON pa.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM logins GROUP BY user_id
) lg ON lg.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM profile_views GROUP BY user_id
) pv ON pv.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count FROM user_sessions GROUP BY user_id
) us ON us.user_id = u.id;
