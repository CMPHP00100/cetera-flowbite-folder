// app/api/user/[id]/route.js
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getDatabase, queryStmt } from "@/lib/database";

export async function GET(req, { params }) {
  try {
    // Await params for Next.js 15+
    const { id } = await params;
    
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Only allow users to look up their own data (or add admin check here)
    if (session.user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const db = getDatabase(process.env);
    const stmt = db.prepare("SELECT id, name, email, role, access_code, created_at, updated_at FROM users WHERE id = ?");
    const user = await queryStmt(stmt, id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error("User lookup error:", error);
    return NextResponse.json({ error: "Failed to lookup user" }, { status: 500 });
  }
}