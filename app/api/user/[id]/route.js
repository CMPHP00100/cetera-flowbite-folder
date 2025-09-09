// app/api/user/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { initD1, getD1 } from "@/lib/d1Local";
import { queryStmt } from "@/lib/database";

export async function GET(req, { params }) {
  await initD1();
  const db = getD1();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = params;
  if (session.user.id !== id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const stmt = db.prepare("SELECT id, name, email, role, access_code, created_at, updated_at FROM users WHERE id = ?");
  const user = await queryStmt(stmt, id);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, user });
}
