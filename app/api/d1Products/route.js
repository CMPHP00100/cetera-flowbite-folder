// app/api/d1Products/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build the SQL query with parameterized queries for security
    let sql = `SELECT * FROM products`;
    let countSql = `SELECT COUNT(*) as total FROM products`;
    let params = [];
    let countParams = [];

    // Add search filter if provided
    if (search) {
      const searchCondition = ` WHERE prName LIKE ? OR description LIKE ?`;
      const searchParam = `%${search}%`;
      sql += searchCondition;
      countSql += searchCondition;
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    // Add pagination
    sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Prepare the queries
    const dataQuery = {
      sql: sql,
      params: params
    };
    
    const countQuery = {
      sql: countSql,
      params: countParams
    };

    // Validate environment variables
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_DATABASE_ID || !process.env.CLOUDFLARE_API_TOKEN) {
      throw new Error('Missing required environment variables');
    }

    // Fetch data from Cloudflare D1
    const [dataResponse, countResponse] = await Promise.all([
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataQuery)
        }
      ),
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(countQuery)
        }
      )
    ]);

    const dataResult = await dataResponse.json();
    const countResult = await countResponse.json();

    // Log the raw responses for debugging
    console.log('Data response:', JSON.stringify(dataResult, null, 2));
    console.log('Count response:', JSON.stringify(countResult, null, 2));

    if (!dataResponse.ok || !countResponse.ok) {
      const errorMessage = dataResult.errors?.[0]?.message || countResult.errors?.[0]?.message || 'Database query failed';
      console.error('Database error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Extract results with better error handling
    const products = dataResult.result?.[0]?.results || [];
    const total = countResult.result?.[0]?.results?.[0]?.total || 0;

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}