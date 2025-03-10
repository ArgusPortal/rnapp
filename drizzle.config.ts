import { defineConfig } from 'drizzle-kit';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

export default defineConfig({
  schema: './backend/db/schema.ts',
  out: './backend/drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.SQLITE_URL || 'file:./backend/sqlite.db',
  },
});
