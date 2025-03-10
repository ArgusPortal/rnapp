const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to run backend commands
const runBackendCommand = (command) => {
  execSync(`cd backend && ${command}`, { 
    stdio: 'inherit',
    cwd: __dirname
  });
};

// Setup and initialize the database
try {
  console.log('Setting up SQLite database...');
  
  // Create an .env file if it doesn't exist
  const envPath = path.join(__dirname, 'backend', '.env');
  const envSamplePath = path.join(__dirname, 'backend', '.env.sample');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envSamplePath)) {
    console.log('Creating .env file from .env.sample...');
    fs.copyFileSync(envSamplePath, envPath);
  }
  
  // Install the latest drizzle-kit if needed
  console.log('Ensuring latest drizzle-kit is installed...');
  try {
    runBackendCommand('npm install drizzle-kit@0.19.1 --save-dev');
  } catch (err) {
    console.log('Could not update drizzle-kit, proceeding with existing version.');
  }
  
  // Create the SQLite database file without requiring sqlite3
  console.log('Creating SQLite database file...');
  execSync('node init-sqlite.js', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  // Apply schema from inside the backend directory where sqlite3 is available
  console.log('Applying schema to database...');
  try {
    // Create scripts directory if it doesn't exist
    const scriptsDir = path.join(__dirname, 'backend', 'scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    
    // Make sure the script file exists
    const scriptPath = path.join(scriptsDir, 'apply-schema.js');
    if (!fs.existsSync(scriptPath)) {
      console.log('Creating schema application script...');
      // Copy the script content to backend/scripts/apply-schema.js
      fs.copyFileSync(
        path.join(__dirname, 'backend', 'scripts', 'apply-schema.js'), 
        scriptPath
      );
    }
    
    runBackendCommand('node scripts/apply-schema.js');
  } catch (err) {
    console.log('Could not apply schema directly:', err.message);
    console.log('Schema will be applied when the server starts.');
  }
  
  // Generate database schema with drizzle-kit
  console.log('Generating database schema...');
  try {
    runBackendCommand('npm run db:generate');
  } catch (err) {
    console.log('Could not generate schema with drizzle-kit:', err.message);
    console.log('Try running: cd backend && npx drizzle-kit generate:sqlite --config=drizzle.config.ts');
  }
  
  console.log('Database setup complete.');
  console.log('You can now start the server with:');
  console.log('cd backend && npm run dev');
} catch (error) {
  console.error('Error setting up database:', error);
  console.error('You can try manually creating the database:');
  console.error('1. Create an empty file at backend/sqlite.db');
  console.error('2. cd backend');
  console.error('3. npm run db:generate');
  console.error('4. npm run dev (this will apply the schema on startup)');
  process.exit(1);
}
