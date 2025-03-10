import { db } from '../db/drizzle';
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { env } from '../config';

// Function to initialize the database and apply migrations
export const initializeDatabase = async () => {
  try {
    console.log('Initializing SQLite database...');
    
    // Get the database path
    const dbPath = env.SQLITE_URL?.replace('file:', '') || 'sqlite.db';
    
    // Check if the database exists, create it if not
    if (!fs.existsSync(dbPath)) {
      console.log(`Creating new database at ${dbPath}`);
      // Apply the schema from schema.sql if available
      const schemaPath = path.join(__dirname, '../schema.sql');
      if (fs.existsSync(schemaPath)) {
        console.log('Applying initial schema...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const sqliteDb = new sqlite3.Database(dbPath);
        await new Promise<void>((resolve, reject) => {
          sqliteDb.exec(schema, (err) => {
            if (err) {
              console.error('Error applying schema:', err);
              reject(err);
            } else {
              console.log('Initial schema applied successfully');
              resolve();
            }
          });
        });
        sqliteDb.close();
      }
    }
    
    // Check and apply Drizzle migrations if available
    const migrationsPath = path.join(__dirname, '../drizzle');
    if (fs.existsSync(migrationsPath)) {
      console.log('Applying Drizzle migrations...');
      
      // Read and sort migration files
      const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      // Apply each migration file
      for (const file of migrationFiles) {
        const migration = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
        console.log(`Applying migration: ${file}`);
        
        // Execute the migration SQL
        await new Promise<void>((resolve, reject) => {
          db.run(migration, (err) => {
            if (err) {
              console.error(`Error applying migration ${file}:`, err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    } else {
      console.log('No Drizzle migrations found. Using schema directly.');
    }
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
