const { execSync } = require('child_process');
const path = require('path');

// Run backend/scripts/apply-schema.js from the root directory
try {
  console.log('Running schema application script...');
  execSync('cd backend && node scripts/apply-schema.js', {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('Error applying schema:', error);
  process.exit(1);
}
