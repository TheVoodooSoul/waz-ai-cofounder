
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    
    // Try to get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@waz.com' },
      select: { id: true, email: true, isAdmin: true }
    });
    
    return NextResponse.json({
      status: 'success',
      message: 'Prisma client is working correctly',
      data: {
        userCount,
        adminUser,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Prisma client failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}
