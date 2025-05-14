//import prisma from "@/lib/prisma"; // Ensure Prisma is correctly set up
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming request body
    console.log("Received body:", body); // Debugging log

    const { email, password } = body; // Extract email and password from body

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the entered password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid password" + isPasswordValid },
        { status: 401 },
      );
    }

    // If email and password match, proceed with login
    return Response.json(
      { message: "Login successful", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
