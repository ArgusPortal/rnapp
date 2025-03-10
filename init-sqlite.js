const fs = require('fs');
const path = require('path');

// Path to the SQLite database file
const dbPath = path.join(__dirname, 'backend', 'sqlite.db');

// Path to the SQL schema file as a fallback
const schemaPath = path.join(__dirname, 'backend', 'schema.sql');

try {
  console.log(`Creating empty SQLite database file at ${dbPath}`);
  
  // Create directory if needed
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create an empty file if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    // Create an empty SQLite database file
    fs.writeFileSync(dbPath, '');
    console.log('Empty database file created successfully.');
  } else {
    console.log('Database file already exists.');
  }
  
  console.log('Schema will be applied when the server starts.');
  
} catch (error) {
  console.error('Error initializing database file:', error);
  process.exit(1);
}
