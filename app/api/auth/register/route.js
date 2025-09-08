// app/api/auth/register/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { role = "END_USER", phone, ...rest } = body; // Extract phone separately
    
    // Prepare data for worker - only include phone if it exists and Worker supports it
    const workerData = {
      ...rest,
      role,
      // Only include phone if provided, otherwise omit it
      ...(phone && { phone })
    };

    console.log("🔍 Registration request received:", {
      ...rest,
      role,
      phone: phone || "not provided",
      password: "[REDACTED]",
    });

    const cfEndpoint = "https://sandbox_flowbite.raspy-math-fdba.workers.dev/register";

    const workerResponse = await fetch(cfEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workerData),
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

    // If phone field caused an error, retry without it
    if (data.error && data.error.includes("phone") && phone) {
      console.log("🔄 Retrying registration without phone field...");
      
      const retryData = {
        ...rest,
        role
      };
      
      const retryResponse = await fetch(cfEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(retryData),
      });
      
      const retryText = await retryResponse.text();
      console.log("📝 Retry response:", retryText);
      
      try {
        data = JSON.parse(retryText);
        return NextResponse.json(data, {
          status: retryResponse.status,
        });
      } catch (retryParseError) {
        console.error("❌ Retry parse error:", retryParseError);
        return NextResponse.json(
          { error: "Authentication service error" },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(data, {
      status: workerResponse.status,
    });
  } catch (error) {
    console.error("❌ Register proxy error:", error);
    return NextResponse.json(
      { error: "Registration service temporarily unavailable" },
      { status: 500 }
    );
  }
}