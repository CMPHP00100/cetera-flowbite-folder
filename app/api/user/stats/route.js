// app/api/user/stats/route.js

export async function GET(request, { env }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.slice(7);
    const sessionResult = await db
    .prepare(`
      SELECT users.id, users.created_at, users.login_count, users.last_login
      FROM user_sessions 
      JOIN users ON user_sessions.user_id = users.id
      WHERE user_sessions.token = ?
    `)
    .bind(token)
    .first();

    if (!sessionResult) {
      return new Response(JSON.stringify({ error: "Invalid session or token" }), { status: 401 });
    }

    return new Response(JSON.stringify({
      loginCount: sessionResult.login_count || 0,
      lastLogin: sessionResult.last_login || null,
      memberSince: sessionResult.created_at || null,
      profileViews: 156, // optional hardcoded/future feature
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error fetching user stats:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch user stats" }), { status: 500 });
  }
}
