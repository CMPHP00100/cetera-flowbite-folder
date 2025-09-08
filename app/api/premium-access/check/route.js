// app/api/premium-access/check/route.js
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getDatabase } from "@/lib/database";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ hasAccess: false });
    }

    // Premium users always have access
    if (session.user.role === "PREMIUM_USER") {
      return NextResponse.json({ hasAccess: true, isPremiumUser: true });
    }

    // Check if user has been granted access via access code
    const db = getDatabase(process.env);
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM premium_access
      WHERE user_id = ?
    `);
    
    const result = stmt.get(session.user.id);
    const hasAccess = result.count > 0;

    return NextResponse.json({ 
      hasAccess,
      isPremiumUser: false,
      grantedAccess: hasAccess 
    });
    
  } catch (err) {
    console.error("Premium access check error:", err);
    return NextResponse.json({ hasAccess: false });
  }
}