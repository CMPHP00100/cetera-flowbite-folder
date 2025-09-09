// app/api/account/update-role/route.js
//import { getServerSession } from "next-auth/next";
import { authOptions, auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import DB from "@/lib/d1Local"; // your D1 wrapper

export async function PUT(req) {
  try {
    const session = await auth();
    //const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newRole } = await req.json();

    if (!["END_USER", "PREMIUM_USER"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role change" }, { status: 400 });
    }

    // Update role in D1
    const query = `
      UPDATE users
      SET role = ?
      WHERE email = ?
      RETURNING id, email, role
    `;

    const result = await DB.prepare(query)
      .bind(newRole, session.user.email)
      .first();

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: result });
  } catch (err) {
    console.error("Role update error:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
