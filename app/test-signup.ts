
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/db";

async function testSignup() {
  console.log('🧪 Testing signup functionality...');
  
  try {
    // Test database connection
    console.log('📊 Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected. Current users: ${userCount}`);
    
    // Test user creation
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`👤 Creating test user: ${testEmail}`);
    
    const hashedPassword = await bcrypt.hash("password123", 12);
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
        name: "Test User",
        companyName: "Test Company",
        focusArea: "business",
        preferences: {
          communicationStyle: "collaborative",
          humorLevel: "moderate",
          technicalDepth: "balanced"
        },
        learningData: {
          sessions: 0,
          preferences: {},
          patterns: {}
        }
      },
    });
    
    console.log('✅ User created successfully!');
    console.log('User ID:', user.id);
    console.log('User email:', user.email);
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    console.log('🗑️ Test user cleaned up');
    console.log('✅ Signup functionality is working properly!');
    
  } catch (error) {
    console.error('❌ Signup test failed:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testSignup().catch(console.error);
