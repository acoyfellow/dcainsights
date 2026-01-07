import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will be disabled.');
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  : null;

export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro',
    priceMonthly: 999,
    priceYearly: 9900,
    priceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    priceIdYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
    features: [
      'Advanced analytics dashboard',
      'Custom portfolio tracking',
      'Export functionality (PDF, CSV)',
      'DCA vs Lump Sum comparison tools',
      'Priority processing',
      'Ad-free experience',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    priceMonthly: 2999,
    priceYearly: 29900,
    priceIdMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_monthly',
    priceIdYearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
    features: [
      'All Pro features',
      'Custom market scenarios',
      'Backtesting tools',
      'Personal DCA strategy advisor',
      'Exclusive educational content',
      'API access included',
      'Priority support',
      'Early access to new features'
    ]
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

export async function createStripeCustomer(email: string, name?: string) {
  if (!stripe) throw new Error('Stripe is not configured');
  
  return stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { source: 'dcainsights' }
  });
}

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  mode = 'subscription'
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'subscription' | 'payment';
}) {
  if (!stripe) throw new Error('Stripe is not configured');
  
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: { address: 'auto', name: 'auto' }
  });
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) throw new Error('Stripe is not configured');
  
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) throw new Error('Stripe is not configured');
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) throw new Error('Stripe is not configured');
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  if (!stripe) throw new Error('Stripe is not configured');
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return stripe.subscriptions.update(subscriptionId, {
    items: [{ id: subscription.items.data[0].id, price: priceId }],
    proration_behavior: 'create_prorations'
  });
}

export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  PAYMENT_FAILED: 'invoice.payment_failed'
} as const;

export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  if (!stripe) throw new Error('Stripe is not configured');
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
