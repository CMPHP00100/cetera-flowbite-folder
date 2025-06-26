// migrate-to-d1.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportUsers() {
  // Replace with your actual user data
  const localUsers = [
    { id: 1, name: 'User One', email: 'user1@example.com', role: 'user' },
    { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
  ];

  const sqlStatements = localUsers.map(user => 
    `INSERT INTO users (id, name, email, role) VALUES (${user.id}, '${user.name.replace(/'/g, "''")}', '${user.email}', '${user.role}');`
  ).join('\n');

  fs.writeFileSync(path.join(__dirname, 'migration.sql'), sqlStatements);
  console.log(`Generated migration.sql with ${localUsers.length} users`);
}

await exportUsers();