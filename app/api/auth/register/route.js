// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "@/lib/database";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get database connection
    const db = getDatabase();
    const query = "SELECT * FROM users WHERE email = ?";
    
    // Retrieve user data
    const userResult = await db.prepare(query).all(email);
    const user = userResult.results?.[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: "24h" }
    );

    // Remove sensitive information before sending user data
    const { password: _, ...userWithoutPassword } = user;

    // Success response
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
