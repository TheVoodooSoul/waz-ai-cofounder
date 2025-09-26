
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdminUser() {
  try {
    console.log('🔧 Fixing admin user configuration...');
    
    const updatedAdmin = await prisma.user.update({
      where: { email: 'admin@waz.com' },
      data: {
        planType: 'ADMIN',
        apiCallsLimit: 999999,
        isAdmin: true
      }
    });
    
    console.log('✅ Admin user updated:', {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      isAdmin: updatedAdmin.isAdmin,
      planType: updatedAdmin.planType,
      apiCallsLimit: updatedAdmin.apiCallsLimit
    });
    
  } catch (error) {
    console.error('❌ Failed to update admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminUser();
