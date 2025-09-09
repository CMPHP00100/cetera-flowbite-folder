// app/api/subscribe/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { generateAccessCode, getDatabase, runStmt, queryStmt } from "@/lib/database";

export async function PUT(req) {
  console.log("🔥 PUT /api/subscribe hit");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    let planType, newRole, accessCode, targetUserId;

    if (body.planType) {
      planType = body.planType;
      newRole = planType === "Premium" ? "CLIENT_ADMIN" : "END_USER";
      targetUserId = session.user.id;

      if (!["Standard", "Premium"].includes(planType)) {
        return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
      }
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

    console.log("🎯 Target user ID:", targetUserId);
    console.log("🎯 New role:", newRole);

    const db = getDatabase(process.env);

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
      console.log("❓ User not found, creating new user...");
      const insertUserStmt = db.prepare(`
        INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
        VALUES (?, ?, ?, '', 'END_USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      await runStmt(insertUserStmt, targetUserId, session.user.name || 'Unknown', session.user.email || 'unknown@example.com');
      currentUser = await queryStmt(userCheckStmt, targetUserId);
    }

    if (currentUser.role === newRole) {
      console.log("⚠️ User already has this role, returning early");
      return NextResponse.json({
        success: true,
        role: newRole,
        message: `User already has ${planType} access!`,
        accessCode: currentUser.access_code,
        alreadyHasRole: true
      });
    }

    if (newRole === "CLIENT_ADMIN" && !accessCode) {
      accessCode = generateAccessCode();
      console.log("🔑 Generated new access code:", accessCode);
    }

    const updateStmt = db.prepare(`
      UPDATE users 
      SET role = ?, access_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    console.log(`📝 Updating user: role="${newRole}", accessCode="${accessCode}", userId="${targetUserId}"`);
    const changes = await runStmt(updateStmt, newRole, accessCode, targetUserId);

    const updatedUser = await queryStmt(userCheckStmt, targetUserId);

    const response = {
      success: true,
      role: updatedUser?.role,
      message: `Successfully updated to ${planType}!`,
      previousRole: currentUser.role,
      userId: targetUserId,
      changes
    };

    if (updatedUser?.access_code) {
      response.accessCode = updatedUser.access_code;
      response.shareableMessage = `Share this access code with others: ${updatedUser.access_code}`;
    }

    return NextResponse.json(response);

  } catch (err) {
    console.error("❌ Subscription error:", err);
    return NextResponse.json({ error: "Failed to update subscription", details: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  console.log("🔥 POST /api/subscribe hit (redeem)");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { accessCode } = await req.json();
    if (!accessCode) return NextResponse.json({ error: "Access code required" }, { status: 400 });

    const db = getDatabase(process.env);

    const premiumUserStmt = db.prepare(`
      SELECT id, name, email, role
      FROM users 
      WHERE access_code = ? AND role = 'CLIENT_ADMIN'
    `);
    const premiumUser = await queryStmt(premiumUserStmt, accessCode);
    if (!premiumUser) return NextResponse.json({ error: "Invalid access code" }, { status: 404 });

    const existingAccessStmt = db.prepare(`
      SELECT id FROM premium_access 
      WHERE user_id = ? AND access_code = ?
    `);
    const existingAccess = await queryStmt(existingAccessStmt, session.user.id, accessCode);

    if (existingAccess) {
      return NextResponse.json({
        success: true,
        message: `You already have access granted by ${premiumUser.name || premiumUser.email}`,
        grantedBy: premiumUser.name || premiumUser.email,
        alreadyHadAccess: true
      });
    }

    const grantStmt = db.prepare(`
      INSERT INTO premium_access (user_id, access_code, granted_by, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    await runStmt(grantStmt, session.user.id, accessCode, premiumUser.id);

    return NextResponse.json({
      success: true,
      message: `Premium access granted by ${premiumUser.name || premiumUser.email}`,
      grantedBy: premiumUser.name || premiumUser.email,
      premiumUserId: premiumUser.id,
      accessCode
    });

  } catch (err) {
    console.error("❌ Access code redemption error:", err);
    return NextResponse.json({ error: "Failed to redeem access code", details: err.message }, { status: 500 });
  }
}
