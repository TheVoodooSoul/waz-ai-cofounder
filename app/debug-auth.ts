import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './lib/db';
import bcrypt from 'bcryptjs';

async function debugAuth() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        password: true,
        createdAt: true
      }
    });

    console.log('\n📋 Users in database:');
    users.forEach((user) => {
      console.log(`- Email: ${user.email}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.firstName} ${user.lastName}`);
      console.log(`  Admin: ${user.isAdmin}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log(`  Password hash length: ${user.password?.length || 'No password'}`);
      console.log(`  Password starts with: ${user.password?.substring(0, 10) || 'N/A'}...`);
      console.log('---');
    });

    // Test password verification for first user if exists
    if (users.length > 0) {
      const testUser = users[0];
      const testPassword = 'password123'; // Common test password
      
      console.log(`\n🔐 Testing password verification for ${testUser.email}:`);
      if (testUser.password) {
        const isValid = await bcrypt.compare(testPassword, testUser.password);
        console.log(`  Testing password "${testPassword}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        
        // Test various common passwords
        const commonPasswords = ['admin123', 'password', '123456', 'admin', 'test123'];
        for (const pwd of commonPasswords) {
          const result = await bcrypt.compare(pwd, testUser.password);
          if (result) {
            console.log(`  ✅ Found working password: "${pwd}"`);
            break;
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();