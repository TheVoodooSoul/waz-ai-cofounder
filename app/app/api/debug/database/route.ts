
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// This is a temporary debug endpoint - REMOVE IN PRODUCTION
// Force deployment timestamp: 1758934418
export async function GET(request: NextRequest) {
  // Security check - only allow if admin query param is provided
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('admin');
  
  if (adminKey !== 'debug_waz_2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@waz.com' },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        planType: true,
        password: true,
        createdAt: true
      }
    });
    
    // Get database info
    const userCount = await prisma.user.count();
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        url_prefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        user_count: userCount
      },
      admin_user: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        isAdmin: adminUser.isAdmin,
        planType: adminUser.planType,
        hasPassword: !!adminUser.password,
        createdAt: adminUser.createdAt
      } : null,
      environment: {
        nextauth_url: process.env.NEXTAUTH_URL,
        has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        has_abacus_api_key: !!process.env.ABACUSAI_API_KEY,
        node_env: process.env.NODE_ENV
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: {
        nextauth_url: process.env.NEXTAUTH_URL,
        has_database_url: !!process.env.DATABASE_URL,
        has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        node_env: process.env.NODE_ENV
      }
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}
