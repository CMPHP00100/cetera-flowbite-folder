//app/api/test/route.js
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      env: {
        hasDB: !!process.env.DB,
        runtime: 'edge'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      success: true, 
      message: 'POST request received',
      receivedData: body
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}