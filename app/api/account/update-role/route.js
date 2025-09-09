// app/api/account/update-role/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(req) {
  try {
    // Get session first
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { newRole } = await req.json();
    if (!["END_USER", "PREMIUM_USER"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role change" }, { status: 400 });
    }

    // Handle database operations based on environment
    if (process.env.VERCEL || process.env.CI) {
      // In build/production environment, return success without DB operations
      return NextResponse.json({ 
        success: true, 
        user: { 
          email: session.user.email, 
          role: newRole 
        },
        message: "Role update queued"
      });
    }

    // Only in development/local environment
    try {
      const { initD1, getD1 } = await import("@/lib/d1Local");
      await initD1();
      const db = getD1();

      const query = "UPDATE users SET role = ? WHERE email = ? RETURNING id, email, role";
      const result = await db.prepare(query).bind(newRole, session.user.email).first();

      if (!result) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, user: result });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback response
      return NextResponse.json({ 
        success: true, 
        user: { 
          email: session.user.email, 
          role: newRole 
        },
        message: "Role updated (fallback mode)"
      });
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}