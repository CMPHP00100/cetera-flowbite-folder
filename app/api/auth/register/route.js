// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/database";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();

    // Input validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get database connection
    const db = getDatabase();
    
    // Insert user
    const insertQuery = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
    const result = await db.prepare(insertQuery).run(name, email, phone, hashedPassword, "END_USER");

    return NextResponse.json({
      success: true,
      user: { id: result.meta.last_row_id, name, email, phone, role: "END_USER" },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    
    if (error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}