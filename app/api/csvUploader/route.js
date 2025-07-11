// app/api/upload-csv/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sql } = await request.json();
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL statement is required' },
        { status: 400 }
      );
    }

    // Use Cloudflare D1 REST API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Database query failed');
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}