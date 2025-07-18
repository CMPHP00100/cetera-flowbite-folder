// app/api/users/route.js - Fixed version
import { getDatabase } from '../../../lib/database';

// IMPORTANT: Use nodejs runtime for better-sqlite3 compatibility
export const runtime = 'nodejs'; // Changed from 'edge'
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    console.log('=== GET /api/users ===');
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');
    
    const db = getDatabase(process.env);
    
    let query = 'SELECT id, name, email, role, created_at FROM users';
    let params = [];
    
    if (searchTerm) {
      query += ' WHERE name LIKE ? OR email LIKE ?';
      params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }
    
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all();
    
    console.log('Query result:', result);
    
    return Response.json({
      users: result.results || result || [],
      count: (result.results || result || []).length
    });
    
  } catch (error) {
    console.error('GET /api/users error:', error);
    return Response.json({
      error: error.message,
      hint: 'Install better-sqlite3 for local dev'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('=== POST /api/users ===');
    const body = await request.json();
    const { name, email, password, role = 'END_USER' } = body;
    
    // Basic validation
    if (!name || !email || !password) {
      return Response.json({
        error: 'Missing required fields: name, email, password'
      }, { status: 400 });
    }
    
    const db = getDatabase(process.env);
    
    // Insert user
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = await stmt.bind(name, email, password, role).run();
    
    console.log('Insert result:', result);
    
    if (result.success) {
      return Response.json({
        message: 'User created successfully',
        userId: result.meta.last_row_id
      }, { status: 201 });
    } else {
      throw new Error('Failed to insert user');
    }
    
  } catch (error) {
    console.error('POST /api/users error:', error);
    return Response.json({
      error: error.message,
      hint: 'Check database connection'
    }, { status: 500 });
  }
}