const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to the SQLite database file
const dbPath = path.join(__dirname, '..', 'sqlite.db');

// Path to the SQL schema file
const schemaPath = path.join(__dirname, '..', 'schema.sql');

try {
  if (!fs.existsSync(dbPath)) {
    console.error('Database file does not exist at:', dbPath);
    console.log('Please run the init-sqlite.js script first.');
    process.exit(1);
  }

  if (!fs.existsSync(schemaPath)) {
    console.error('Schema file does not exist at:', schemaPath);
    process.exit(1);
  }

  console.log('Applying schema to database at:', dbPath);
  
  // Read the schema file
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Open the database and apply the schema
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
    
    console.log('Connected to the database.');
    
    // Apply the schema
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error applying schema:', err.message);
        db.close();
        process.exit(1);
      }
      
      console.log('Schema applied successfully.');
      
      // Close the database
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
    });
  });
} catch (error) {
  console.error('Error applying schema:', error);
  process.exit(1);
}
