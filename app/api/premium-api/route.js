//app/api/premium-api/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Handle access check based on environment
    let hasAccess = false;
    
    try {
      // Try to import access helper
      const { hasAccess: checkAccess } = await import("@/lib/access");
      hasAccess = checkAccess(session.user.role, "premium");
    } catch (accessError) {
      console.error("Access check error:", accessError);
      // Fallback access check
      const premiumRoles = ["PREMIUM_USER", "CLIENT_ADMIN", "SUPPLIER_ADMIN", "PROVIDER_ADMIN"];
      hasAccess = premiumRoles.includes(session.user.role);
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      message: "Welcome to premium content!",
      user: {
        email: session.user.email,
        role: session.user.role
      }
    });
  } catch (error) {
    console.error("Premium API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}