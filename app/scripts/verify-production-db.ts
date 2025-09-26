
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database connection and admin user...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@waz.com' }
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found in this database');
      console.log('Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@waz.com',
          name: 'Admin User',
          firstName: 'Admin',
          lastName: 'User',
          password: hashedPassword,
          isAdmin: true,
          planType: 'ADMIN',
          apiCallsLimit: 999999,
        },
      });
      
      console.log('✅ Admin user created:', {
        id: newAdmin.id,
        email: newAdmin.email,
        isAdmin: newAdmin.isAdmin,
        planType: newAdmin.planType
      });
    } else {
      console.log('✅ Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
        planType: adminUser.planType,
        hasPassword: !!adminUser.password
      });
      
      // Verify password
      if (adminUser.password) {
        const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
        console.log('🔑 Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
        
        if (!isPasswordValid) {
          console.log('Updating password...');
          const hashedPassword = await bcrypt.hash('admin123', 10);
          await prisma.user.update({
            where: { email: 'admin@waz.com' },
            data: { password: hashedPassword }
          });
          console.log('✅ Password updated');
        }
      } else {
        console.log('Setting password for admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.update({
          where: { email: 'admin@waz.com' },
          data: { password: hashedPassword }
        });
        console.log('✅ Password set');
      }
    }
    
    // Count total users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // List all users (first 10)
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        planType: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('👥 Recent users:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name}) - Admin: ${user.isAdmin} - Plan: ${user.planType} - Created: ${user.createdAt.toISOString()}`);
    });
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
