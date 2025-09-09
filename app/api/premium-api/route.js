//app/api/premium-api/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hasAccess } from "@/lib/access";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!hasAccess(session.user.role, "premium")) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ message: "Welcome to premium content!" });
}
