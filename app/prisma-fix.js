
#!/usr/bin/env node

// This script ensures Prisma client is generated properly in production

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Prisma Production Fix Script');

try {
  // Ensure we're in the right directory
  const appDir = __dirname;
  process.chdir(appDir);
  
  console.log('📦 Current directory:', process.cwd());
  
  // Check if schema exists
  const schemaPath = path.join(appDir, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Prisma schema not found at: ' + schemaPath);
  }
  
  console.log('📄 Prisma schema found');
  
  // Generate Prisma client
  console.log('🚀 Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: appDir
  });
  
  console.log('✅ Prisma client generated successfully!');
  
} catch (error) {
  console.error('❌ Prisma fix failed:', error.message);
  process.exit(1);
}
