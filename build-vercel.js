
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Starting Vercel Build Process...');

try {
  console.log('📦 Generating Prisma Client...');
  execSync('prisma generate', { 
    cwd: '/var/task/app',
    stdio: 'inherit'
  });
  
  console.log('🏗️ Building Next.js Application...');
  execSync('next build', { 
    cwd: '/var/task/app',
    stdio: 'inherit'
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
