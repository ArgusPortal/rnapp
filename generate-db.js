const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Change directory to backend and run the command
try {
  console.log('Running drizzle-kit generate in backend directory...');
  
  // Use npm run db:generate instead of direct npx call
  // This ensures we use the locally installed drizzle-kit
  execSync('cd backend && npm run db:generate', { 
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('Error generating database schema:', error);
  process.exit(1);
}
