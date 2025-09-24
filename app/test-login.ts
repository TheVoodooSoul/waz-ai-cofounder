
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './lib/db';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    const email = 'admin@waz.com';
    const password = 'admin123';
    
    console.log(`🧪 Testing login for: ${email}`);
    console.log(`🔐 Testing password: ${password}`);

    // This simulates what happens in the NextAuth authorize function
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      console.log('❌ User not found or no password');
      return;
    }

    console.log(`✅ User found: ${user.email}`);
    console.log(`👤 Name: ${user.firstName} ${user.lastName}`);
    console.log(`🔑 Admin: ${user.isAdmin}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password check: ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);

    if (isPasswordValid) {
      console.log('\n🎉 Login should work with these credentials:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
