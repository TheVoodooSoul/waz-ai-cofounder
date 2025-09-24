
import { prisma } from './db';

export interface UsageResult {
  allowed: boolean;
  reason?: string;
  user: {
    isAdmin: boolean;
    planType: string;
    apiCallsUsed: number;
    apiCallsLimit: number;
  };
}

export async function checkUsage(userId: string): Promise<UsageResult> {
  try {
    // Get user's current usage and plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isAdmin: true,
        planType: true,
        apiCallsUsed: true,
        apiCallsLimit: true,
        planExpires: true
      }
    });

    if (!user) {
      return {
        allowed: false,
        reason: 'User not found',
        user: { isAdmin: false, planType: 'FREE', apiCallsUsed: 0, apiCallsLimit: 0 }
      };
    }

    // Admin users get unlimited access
    if (user.isAdmin || user.planType === 'ADMIN') {
      return {
        allowed: true,
        user: {
          isAdmin: user.isAdmin,
          planType: user.planType,
          apiCallsUsed: user.apiCallsUsed,
          apiCallsLimit: user.apiCallsLimit
        }
      };
    }

    // Check if plan has expired (for paid plans)
    if (user.planExpires && new Date() > user.planExpires) {
      return {
        allowed: false,
        reason: 'Plan expired - please upgrade your subscription',
        user: {
          isAdmin: user.isAdmin,
          planType: user.planType,
          apiCallsUsed: user.apiCallsUsed,
          apiCallsLimit: user.apiCallsLimit
        }
      };
    }

    // Check usage limits
    if (user.apiCallsUsed >= user.apiCallsLimit) {
      const planUpgrades = {
        FREE: 'BASIC ($29/month for 100 calls)',
        BASIC: 'PRO ($97/month for 500 calls)',
        PRO: 'UNLIMITED ($297/month for unlimited calls)'
      };
      
      return {
        allowed: false,
        reason: `Monthly limit reached (${user.apiCallsLimit} calls). Upgrade to ${planUpgrades[user.planType as keyof typeof planUpgrades] || 'a higher plan'}.`,
        user: {
          isAdmin: user.isAdmin,
          planType: user.planType,
          apiCallsUsed: user.apiCallsUsed,
          apiCallsLimit: user.apiCallsLimit
        }
      };
    }

    // Usage allowed
    return {
      allowed: true,
      user: {
        isAdmin: user.isAdmin,
        planType: user.planType,
        apiCallsUsed: user.apiCallsUsed,
        apiCallsLimit: user.apiCallsLimit
      }
    };

  } catch (error) {
    console.error('Usage check error:', error);
    return {
      allowed: false,
      reason: 'Usage check failed',
      user: { isAdmin: false, planType: 'FREE', apiCallsUsed: 0, apiCallsLimit: 0 }
    };
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true, planType: true }
    });

    // Don't increment usage for admins
    if (user?.isAdmin || user?.planType === 'ADMIN') {
      return;
    }

    // Increment usage for regular users
    await prisma.user.update({
      where: { id: userId },
      data: {
        apiCallsUsed: {
          increment: 1
        }
      }
    });
  } catch (error) {
    console.error('Failed to increment usage:', error);
  }
}
