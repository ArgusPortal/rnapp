const { execSync } = require('child_process');

// Start the backend server
try {
  console.log('Starting backend server...');
  
  execSync('cd backend && npm run dev', {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}
