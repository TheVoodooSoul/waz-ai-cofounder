
import dotenv from 'dotenv';
dotenv.config();
import { authOptions } from './lib/auth';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/db';

async function testAuth() {
  try {
    console.log('🔐 Testing authentication flow...');
    
    // Test credentials provider directly
    const credentials = {
      email: 'john@doe.com',
      password: 'password123'
    };
    
    console.log('👤 Testing with credentials:', credentials.email);
    
    // Simulate the authorize function from auth.ts
    if (!credentials?.email || !credentials?.password) {
      console.log('❌ No credentials provided');
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user || !user.password) {
      console.log('❌ User not found or no password');
      return null;
    }

    console.log('✅ User found:', user.email);

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return null;
    }

    console.log('✅ Password is valid');

    const userResult = {
      id: user.id,
      email: user.email || '',
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      focusArea: user.focusArea,
    };

    console.log('✅ Authentication successful!');
    console.log('👤 User object:', userResult);
    
    return userResult;

  } catch (error) {
    console.error('❌ Auth test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
