import { json, error } from '@sveltejs/kit';
import { 
  stripe, 
  SUBSCRIPTION_PLANS, 
  createStripeCustomer, 
  createCheckoutSession,
  isStripeConfigured,
  validatePriceId
} from '$lib/server/stripe';
import { createUserWithSession, validateSession } from '$lib/server/auth';
import { db } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    if (!stripe) {
      throw error(500, 'Stripe is not configured');
    }
    
    const body = await request.json() as { planId?: string; billingInterval?: string; email?: string; name?: string };
    const { planId, billingInterval, email, name } = body;
    
    if (!planId || !billingInterval) {
      throw error(400, 'Missing required fields: planId, billingInterval');
    }
    
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) {
      throw error(400, 'Invalid plan ID');
    }
    
    const priceId = billingInterval === 'yearly' 
      ? plan.priceIdYearly 
      : plan.priceIdMonthly;
    
    let user;
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      const session = await validateSession(token);
      if (session) {
        user = await db.getUserById(session.userId);
      }
    }
    
    if (!user && email) {
      const { user: newUser } = await createUserWithSession(email, name);
      user = newUser;
      token = 'sess_' + Math.random().toString(36).substring(2, 45);
    }
    
    if (!user) {
      throw error(400, 'User not found and no email provided');
    }
    
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await createStripeCustomer(user.email, user.name);
      customerId = customer.id;
      await db.updateUser(user.id, { stripeCustomerId: customerId });
    }
    
    const origin = url.origin;
    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancelUrl: `${origin}/pricing?canceled=true`
    });
    
    return json({
      sessionId: session.id,
      url: session.url
    });
  } catch (err) {
    console.error('Checkout error:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to create checkout session');
  }
};
