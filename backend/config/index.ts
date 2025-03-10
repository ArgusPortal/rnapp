import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || '3000',
  SQLITE_URL: process.env.SQLITE_URL || 'file:./sqlite.db',
  
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
};

export const constants = {
	BEFORE_ALL_TIMEOUT: 30000, // 30 sec
	port: process.env.PORT || 8000,
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200,
};
