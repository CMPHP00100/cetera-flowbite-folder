// app/api/auth/register/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log("🔍 Registration request received:", { 
      ...body, 
      password: '[REDACTED]' 
    });

    const cfEndpoint = "https://sandbox_flowbite.raspy-math-fdba.workers.dev/register";
    
    const workerResponse = await fetch(cfEndpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        ...body, 
        role: "END_USER"
      }),
    });

    const resText = await workerResponse.text();
    console.log("📝 Worker response:", resText);

    let data;
    try {
      data = JSON.parse(resText);
    } catch (parseError) {
      console.error("❌ Parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid response from authentication service" },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { 
      status: workerResponse.status 
    });

  } catch (error) {
    console.error("❌ Register proxy error:", error);
    return NextResponse.json(
      { error: "Registration service temporarily unavailable" },
      { status: 500 }
    );
  }
}