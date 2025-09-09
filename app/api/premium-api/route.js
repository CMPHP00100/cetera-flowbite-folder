//app/api/premium-api/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { hasAccess } from "@/lib/access";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  if (!hasAccess(session.user.role, "premium")) {
    return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
  }

  return new Response(
    JSON.stringify({ message: "Welcome to premium content!" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
