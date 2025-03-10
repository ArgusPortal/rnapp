
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { env } from '../config';
import * as schema from './schema';

// Remove 'file:' prefix if present and resolve path
const dbPath = env.SQLITE_URL?.replace('file:', '') || path.join(__dirname, '..', 'sqlite.db');

console.log(`Connecting to SQLite database at: ${dbPath}`);

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
