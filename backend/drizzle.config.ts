import { defineConfig } from 'drizzle-kit';
import { env } from './config';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.SQLITE_URL || 'file:./sqlite.db',
  },
});
