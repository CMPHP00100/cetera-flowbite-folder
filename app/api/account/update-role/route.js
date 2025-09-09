// app/api/account/update-role/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { initD1, getD1 } from "@/lib/d1Local";

export async function PUT(req) {
  await initD1();
  const db = getD1();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { newRole } = await req.json();
  if (!["END_USER", "PREMIUM_USER"].includes(newRole)) return NextResponse.json({ error: "Invalid role change" }, { status: 400 });

  const query = "UPDATE users SET role = ? WHERE email = ? RETURNING id, email, role";
  const result = await db.prepare(query).bind(newRole, session.user.email).first();

  if (!result) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, user: result });
}


