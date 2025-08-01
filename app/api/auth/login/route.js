// app/api/auth/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Forward the login request to your Cloudflare Worker
    const workerResponse = await fetch("https://sandbox_flowbite.raspy-math-fdba.workers.dev/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Worker response status:", workerResponse.status); // Log worker response
    const data = await workerResponse.json();
    console.log("Worker response data:", data); // Log worker response data

    if (workerResponse.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || "Login failed" },
        { status: workerResponse.status }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
