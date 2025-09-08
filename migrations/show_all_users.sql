SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    pa.id AS premium_access_id,
    pa.access_code,
    pa.granted_by,
    l.id AS login_id,
    l.timestamp AS login_timestamp,
    pv.id AS profile_view_id,
    pv.timestamp AS profile_view_timestamp
FROM users u
LEFT JOIN premium_access pa ON pa.user_id = u.id
LEFT JOIN logins l ON l.user_id = u.id
LEFT JOIN profile_views pv ON pv.user_id = u.id
ORDER BY u.email
LIMIT 50;
