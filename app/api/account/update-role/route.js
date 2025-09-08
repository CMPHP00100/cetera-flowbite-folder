//app/api/account/update-role/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma"; // adjust if needed
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newRole } = await req.json();
    if (!["END_USER", "PREMIUM_USER"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role change" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role: newRole },
      select: { id: true, email: true, role: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Role update error:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
