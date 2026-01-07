import { json, error } from '@sveltejs/kit';
import { cancelSubscription, updateSubscription } from '$lib/server/stripe';
import { validateSession } from '$lib/server/auth';
import { db } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw error(401, 'Unauthorized');
    }
    
    const session = await validateSession(token);
    if (!session) {
      throw error(401, 'Invalid session');
    }
    
    const user = await db.getUserById(session.userId);
    if (!user) {
      throw error(404, 'User not found');
    }
    
    return json({
      tier: user.subscriptionTier || 'free',
      status: user.subscriptionStatus || 'active',
      periodEnd: user.subscriptionPeriodEnd || null,
      subscriptionId: user.subscriptionId || null
    });
  } catch (err) {
    console.error('Get subscription error:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to get subscription');
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw error(401, 'Unauthorized');
    }
    
    const session = await validateSession(token);
    if (!session) {
      throw error(401, 'Invalid session');
    }
    
    const user = await db.getUserById(session.userId);
    if (!user?.subscriptionId) {
      throw error(400, 'No active subscription found');
    }
    
    const { action, newPriceId } = await request.json();
    
    switch (action) {
      case 'cancel': {
        await cancelSubscription(user.subscriptionId);
        await db.updateUser(user.id, {
          subscriptionStatus: 'canceled',
          subscriptionTier: 'free'
        });
        break;
      }
      
      case 'upgrade':
      case 'downgrade': {
        if (!newPriceId) {
          throw error(400, 'newPriceId required for upgrade/downgrade');
        }
        await updateSubscription(user.subscriptionId, newPriceId);
        break;
      }
      
      default:
        throw error(400, 'Invalid action');
    }
    
    return json({ success: true });
  } catch (err) {
    console.error('Subscription action error:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to process subscription action');
  }
};
