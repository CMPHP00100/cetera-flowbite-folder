// app/api/events/route.js
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, location, startTime, endTime } = body;

    // Input validation
    if (!title || !description || !location || !startTime || !endTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate time
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Forward the request to your Cloudflare Worker
    const workerUrl = process.env.NODE_ENV === 'development' 
      ? process.env.NEXT_PUBLIC_DEV_API_URL || 'http://localhost:8787'
      : process.env.NEXT_PUBLIC_PROD_API_URL || 'https://sandbox_flowbite.raspy-math-fdba.workers.dev';

    console.log(`Forwarding to worker: ${workerUrl}/api/events`);

    const workerResponse = await fetch(`${workerUrl}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        location,
        startTime,
        endTime,
      }),
    });

    console.log("Worker response status:", workerResponse.status);
    const data = await workerResponse.json();
    console.log("Worker response data:", data);

    if (workerResponse.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to create event" },
        { status: workerResponse.status }
      );
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Forward the request to your Cloudflare Worker for fetching events
    const workerUrl = process.env.NODE_ENV === 'development' 
      ? process.env.NEXT_PUBLIC_DEV_API_URL || 'http://localhost:8787'
      : process.env.NEXT_PUBLIC_PROD_API_URL || 'https://sandbox_flowbite.raspy-math-fdba.workers.dev';

    const workerResponse = await fetch(`${workerUrl}/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await workerResponse.json();

    if (workerResponse.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to fetch events" },
        { status: workerResponse.status }
      );
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}