
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './lib/db';
import bcrypt from 'bcryptjs';

async function createProductionUser() {
  try {
    console.log('🌐 Checking current database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    // Check existing users first
    const existingUsers = await prisma.user.findMany({
      select: {
        email: true,
        isAdmin: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\n📋 Current users in this database:');
    existingUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} ${user.isAdmin ? '(ADMIN)' : ''} - Created: ${user.createdAt.toISOString().split('T')[0]}`);
    });

    // Update admin user - simpler approach
    const adminEmail = 'admin@waz.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log(`\n✅ Admin user ready!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔐 Password: ${adminPassword}`);
    console.log(`🎯 User ID: ${adminUser.id}`);
    console.log(`👑 Admin Status: ${adminUser.isAdmin}`);

    // Test the password
    const isValid = await bcrypt.compare(adminPassword, adminUser.password!);
    console.log(`🧪 Password test: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

  } catch (error) {
    console.error('❌ Error:', error);
    
    // Show more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack?.substring(0, 500));
    }
  } finally {
    await prisma.$disconnect();
  }
}

createProductionUser();
