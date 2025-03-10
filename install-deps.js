const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Install dependencies in backend directory
try {
  console.log('Installing dependencies in backend directory...');
  
  // Change to backend directory and run commands
  execSync('cd backend && npm install', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('Creating package lock file...');
  execSync('cd backend && npm i --package-lock-only', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  // Don't try to fix security vulnerabilities automatically
  // as they're mostly related to dev dependencies
  console.log('Dependencies installed successfully!');
  console.log('Note: Some dependencies have security vulnerabilities.');
  console.log('Run "cd backend && npm audit" to see details.');
  
} catch (error) {
  console.error('Error in dependency management:', error);
  process.exit(1);
}
