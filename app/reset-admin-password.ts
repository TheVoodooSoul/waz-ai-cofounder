
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './lib/db';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  try {
    console.log('🔍 Finding admin user...');
    
    const adminUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@waz.com' },
          { isAdmin: true }
        ]
      }
    });

    if (!adminUser) {
      console.log('❌ No admin user found');
      return;
    }

    console.log(`✅ Found admin: ${adminUser.email}`);

    // Set a new password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { 
        password: hashedPassword,
        isAdmin: true  // Make sure admin flag is set
      }
    });

    console.log(`✅ Password reset successfully!`);
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔐 New password: ${newPassword}`);
    
    // Test the new password
    console.log('\n🧪 Testing new password...');
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log(`Password validation: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
