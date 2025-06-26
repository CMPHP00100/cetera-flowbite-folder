import { getDatabase } from '../lib/database';

// Test the database wrapper directly
async function testDb() {
  const db = getDatabase({});
  
  if (!db) throw new Error('No database in dev mode');
  
  // Test insert
  const insert = await db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).bind('Test User', 'test@local.dev', 'unhashed-for-test', 'END_USER').run();
  
  console.log('Inserted ID:', insert.meta.last_row_id);
  
  // Test query
  const users = await db.prepare(
    'SELECT id, email FROM users LIMIT 5'
  ).all();
  
  console.log('First 5 users:', users.results);
}

testDb().catch(console.error);