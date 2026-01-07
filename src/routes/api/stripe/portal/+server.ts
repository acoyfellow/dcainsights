import { json, error } from '@sveltejs/kit';
import { createCustomerPortalSession } from '$lib/server/stripe';
import { validateSession } from '$lib/server/auth';
import { db } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
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
    if (!user?.stripeCustomerId) {
      throw error(400, 'No billing account found');
    }
    
    const origin = url.origin;
    const portalSession = await createCustomerPortalSession(
      user.stripeCustomerId,
      `${origin}/account`
    );
    
    return json({ url: portalSession.url });
  } catch (err) {
    console.error('Portal error:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to create billing portal session');
  }
};
