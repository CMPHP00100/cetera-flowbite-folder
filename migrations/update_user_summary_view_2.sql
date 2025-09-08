SELECT 
    user_id,
    name,
    email,
    role,
    is_premium,
    premium_access_count,
    login_count,
    profile_views_count,
    active_sessions_count,
    (premium_access_count + login_count + profile_views_count + active_sessions_count) AS activity_score,
    CASE 
        WHEN premium_access_count = 0 
             AND login_count = 0 
             AND profile_views_count = 0 
             AND active_sessions_count = 0
        THEN 1
        ELSE 0
    END AS inactive_user
FROM user_summary
ORDER BY is_premium DESC, activity_score DESC, email ASC
LIMIT 50;
