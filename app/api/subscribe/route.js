// app/api/subscribe/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { generateAccessCode, runStmt, queryStmt } from "@/lib/database";
import { initD1, getD1 } from "@/lib/d1Local";

export async function PUT(req) {
  await initD1();
  const db = getD1();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  let planType, newRole, accessCode, targetUserId;

  if (body.planType) {
    planType = body.planType;
    newRole = planType === "Premium" ? "CLIENT_ADMIN" : "END_USER";
    targetUserId = session.user.id;
  } else if (body.newRole && body.userId) {
    newRole = body.newRole === "PREMIUM_USER" ? "CLIENT_ADMIN" :
              body.newRole === "END_USER" ? "END_USER" : body.newRole;
    accessCode = body.accessCode;
    targetUserId = body.userId;
    planType = newRole === "CLIENT_ADMIN" ? "Premium" : "Standard";
  } else {
    return NextResponse.json({
      error: "Invalid request format. Expected { planType } or { newRole, userId }"
    }, { status: 400 });
  }

  const allowedRoles = [
    "GLOBAL_ADMIN", "GLOBAL_SUPPORT", "PROVIDER_ADMIN", "PROVIDER_SUPPORT",
    "SUPPLIER_ADMIN", "SUPPLIER_SUPPORT", "CLIENT_ADMIN", "CLIENT_SUPPORT",
    "END_USER", "STANDARD_USER", "PREMIUM_USER"
  ];
  if (!allowedRoles.includes(newRole)) {
    return NextResponse.json({ error: `Invalid role: ${newRole}`, allowedRoles }, { status: 400 });
  }

  const userCheckStmt = db.prepare("SELECT id, role, access_code FROM users WHERE id = ?");
  let currentUser = await queryStmt(userCheckStmt, targetUserId);

  if (!currentUser) {
    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
      VALUES (?, ?, ?, '', 'END_USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    await runStmt(insertUserStmt, targetUserId, session.user.name || 'Unknown', session.user.email || 'unknown@example.com');
    currentUser = await queryStmt(userCheckStmt, targetUserId);
  }

  if (currentUser.role === newRole) {
    return NextResponse.json({
      success: true,
      role: newRole,
      message: `User already has ${planType} access!`,
      accessCode: currentUser.access_code,
      alreadyHasRole: true
    });
  }

  if (newRole === "CLIENT_ADMIN" && !accessCode) accessCode = generateAccessCode();

  const updateStmt = db.prepare(`
    UPDATE users 
    SET role = ?, access_code = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const changes = await runStmt(updateStmt, newRole, accessCode, targetUserId);

  const updatedUser = await queryStmt(userCheckStmt, targetUserId);

  return NextResponse.json({
    success: true,
    role: updatedUser?.role,
    message: `Successfully updated to ${planType}!`,
    previousRole: currentUser.role,
    userId: targetUserId,
    changes,
    accessCode: updatedUser?.access_code,
    shareableMessage: updatedUser?.access_code ? `Share this access code: ${updatedUser.access_code}` : undefined
  });
}

export async function POST(req) {
  await initD1();
  const db = getD1();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { accessCode } = await req.json();
  if (!accessCode) return NextResponse.json({ error: "Access code required" }, { status: 400 });

  const premiumUserStmt = db.prepare("SELECT id, name, email, role FROM users WHERE access_code = ? AND role = 'CLIENT_ADMIN'");
  const premiumUser = await queryStmt(premiumUserStmt, accessCode);
  if (!premiumUser) return NextResponse.json({ error: "Invalid access code" }, { status: 404 });

  const existingAccessStmt = db.prepare("SELECT id FROM premium_access WHERE user_id = ? AND access_code = ?");
  const existingAccess = await queryStmt(existingAccessStmt, session.user.id, accessCode);

  if (existingAccess) {
    return NextResponse.json({
      success: true,
      message: `You already have access granted by ${premiumUser.name || premiumUser.email}`,
      grantedBy: premiumUser.name || premiumUser.email,
      alreadyHadAccess: true
    });
  }

  const grantStmt = db.prepare("INSERT INTO premium_access (user_id, access_code, granted_by, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)");
  await runStmt(grantStmt, session.user.id, accessCode, premiumUser.id);

  return NextResponse.json({
    success: true,
    message: `Premium access granted by ${premiumUser.name || premiumUser.email}`,
    grantedBy: premiumUser.name || premiumUser.email,
    premiumUserId: premiumUser.id,
    accessCode
  });
}
