import { error } from '@sveltejs/kit';
import { 
  stripe, 
  STRIPE_WEBHOOK_EVENTS, 
  verifyWebhookSignature 
} from '$lib/server/stripe';
import { db } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!stripe) {
      throw error(500, 'Stripe is not configured');
    }
    
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      throw error(400, 'Missing Stripe signature');
    }
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw error(500, 'Stripe webhook secret not configured');
    }
    
    const body = await request.text();
    const event = verifyWebhookSignature(body, signature, webhookSecret);
    
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
        const session = event.data.object;
        const customerId = session.customer as string;
        const amountTotal = session.amount_total || 0;
        
        // Log purchase event for analytics
        try {
          await fetch(`${process.env.PLATFORM_URL || ''}/api/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'purchase',
              value: amountTotal / 100, // Convert cents to dollars
              metadata: {
                sessionId: session.id,
                customerId,
                currency: session.currency,
              }
            })
          }).catch(() => {}); // Don't fail webhook if event logging fails
        } catch {}

        const user = await db.getUserByStripeCustomerId(customerId);
        if (user) {
          await db.updateUser(user.id, { subscriptionTier: 'free' });
        }
        break;
      }
      
      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        
        let tier: 'free' | 'pro' | 'premium' = 'free';
        if (status === 'active' || status === 'trialing') {
          const priceId = subscription.items.data[0]?.price.id || '';
          if (priceId.includes('premium')) {
            tier = 'premium';
          } else if (priceId.includes('pro')) {
            tier = 'pro';
          }
        }
        
        const user = await db.getUserByStripeCustomerId(customerId);
        if (user) {
          await db.updateUserSubscription(user.id, {
            tier,
            subscriptionId: subscription.id,
            status: status as 'active' | 'canceled' | 'past_due' | 'trialing',
            periodEnd: subscription.current_period_end * 1000
          });
        }
        break;
      }
      
      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        const user = await db.getUserByStripeCustomerId(customerId);
        if (user) {
          await db.updateUserSubscription(user.id, {
            tier: 'free',
            subscriptionId: subscription.id,
            status: 'canceled',
            periodEnd: Date.now()
          });
        }
        break;
      }
      
      case STRIPE_WEBHOOK_EVENTS.PAYMENT_FAILED: {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        
        const user = await db.getUserByStripeCustomerId(customerId);
        if (user) {
          await db.updateUser(user.id, { subscriptionStatus: 'past_due' });
        }
        break;
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Webhook error:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Webhook processing failed');
  }
};
