const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Unified Development Server...\n');

// Start Vite dev server
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Start unified server
const serverProcess = spawn('node', ['unified-server.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  viteProcess.kill('SIGINT');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  viteProcess.kill('SIGTERM');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

// Handle process errors
viteProcess.on('error', (err) => {
  console.error('❌ Vite process error:', err);
});

serverProcess.on('error', (err) => {
  console.error('❌ Server process error:', err);
});

console.log('✅ Development servers started!');
console.log('📱 Frontend: http://localhost:8080');
console.log('🔧 API: http://localhost:3000/api');
console.log('❤️  Health: http://localhost:3000/health');
console.log('\nPress Ctrl+C to stop both servers\n');
