const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Install the correct SQLite adapter for Drizzle
try {
  console.log('Installing SQLite adapter for Drizzle...');
  
  // Install better-sqlite3 which is compatible with Drizzle
  execSync('cd backend && npm install better-sqlite3 --save', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  // Update drizzle.ts file
  const drizzleFilePath = path.join(__dirname, 'backend', 'db', 'drizzle.ts');
  
  const newContent = `
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { env } from '../config';
import * as schema from './schema';

// Remove 'file:' prefix if present and resolve path
const dbPath = env.SQLITE_URL?.replace('file:', '') || path.join(__dirname, '..', 'sqlite.db');

console.log(\`Connecting to SQLite database at: \${dbPath}\`);

// Create SQLite connection with better-sqlite3
const sqlite = new Database(dbPath);

// Enable foreign keys for better referential integrity
sqlite.pragma('foreign_keys = ON');

// Configure the Drizzle client
export const db = drizzle(sqlite, {
  schema,
  logger: true,
});

// Add a run method compatible with the one used in init-db.ts
db.run = (query, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      sqlite.exec(query);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
`;

  fs.writeFileSync(drizzleFilePath, newContent);
  console.log('Updated db/drizzle.ts with better-sqlite3 adapter');
  
  console.log('SQLite adapter installed successfully!');
  console.log('Now try starting the server with: node start-server.js');
} catch (error) {
  console.error('Error installing database dependencies:', error);
  process.exit(1);
}
