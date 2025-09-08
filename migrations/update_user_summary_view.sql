DROP VIEW IF EXISTS user_summary;

CREATE VIEW user_summary AS
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    CASE WHEN u.role = 'PREMIUM_USER' THEN 1 ELSE 0 END AS is_premium,
    COUNT(DISTINCT pa.id) AS premium_access_count,
    COUNT(DISTINCT l.id) AS login_count,
    COUNT(DISTINCT pv.id) AS profile_views_count,
    COUNT(DISTINCT us.id) AS active_sessions_count
FROM users u
LEFT JOIN premium_access pa ON pa.user_id = u.id
LEFT JOIN logins l ON l.user_id = u.id
LEFT JOIN profile_views pv ON pv.viewed_user_id = u.id
LEFT JOIN user_sessions us ON us.user_id = u.id
GROUP BY u.id, u.name, u.email, u.role
ORDER BY u.email;
