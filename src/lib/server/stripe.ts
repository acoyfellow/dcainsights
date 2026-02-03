import Stripe from 'stripe';

// =============================================================================
// STRIPE CONFIGURATION VALIDATION
// =============================================================================

// Environment variable validation
const REQUIRED_ENV_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_PRO_MONTHLY_PRICE_ID',
  'STRIPE_PRO_YEARLY_PRICE_ID',
  'STRIPE_PREMIUM_MONTHLY_PRICE_ID',
  'STRIPE_PREMIUM_YEARLY_PRICE_ID',
] as const;

const OPTIONAL_ENV_VARS = [
  'STRIPE_WEBHOOK_SECRET', // Required for webhook processing
  'STRIPE_TEST_SECRET_KEY', // Deprecated - use STRIPE_SECRET_KEY
] as const;

// Track which env vars are missing for debugging
const missingEnvVars: string[] = [];
const configuredEnvVars: string[] = [];

for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    missingEnvVars.push(envVar);
  } else {
    configuredEnvVars.push(envVar);
  }
}

// Stripe is disabled if required env vars are missing
export const isStripeConfigured = missingEnvVars.length === 0;

if (!isStripeConfigured) {
  console.warn(
    `\n⚠️  STRIPE DISABLED: Missing required environment variables:\n` +
    `   ${missingEnvVars.join('\n   ')}\n\n` +
    `   Stripe payment functionality will be unavailable.\n` +
    `   See docs/STRIPE_SETUP.md for configuration instructions.\n`
  );
} else {
  console.log('✅ Stripe configured successfully');
}

// Check if webhook secret is configured (separate warning)
if (isStripeConfigured && !process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn(
    '⚠️  STRIPE_WEBHOOK_SECRET not set - webhook signature verification disabled!\n' +
    '   This is a security risk in production.'
  );
}

// =============================================================================
// STRIPE CLIENT INITIALIZATION
// =============================================================================

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

// Check if we're using test mode (key starts with sk_test_)
export const isTestMode = stripeSecretKey.startsWith('sk_test_');

if (stripe && isTestMode) {
  console.log('ℹ️  Stripe is running in TEST MODE');
}

// =============================================================================
// SUBSCRIPTION PLANS CONFIGURATION
// =============================================================================

/**
 * Subscription plan configuration
 * 
 * Price IDs MUST be set via environment variables.
 * Prices shown here are display values only - actual prices are in Stripe.
 * 
 * PRO TIER:
 *   - Monthly: $9.99/month
 *   - Yearly: $99.99/year (~$8.33/month, 17% savings)
 * 
 * PREMIUM TIER:
 *   - Monthly: $29.99/month
 *   - Yearly: $299.99/year (~$25/month, 17% savings)
 */
export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro',
    // Display prices in cents for Stripe compatibility
    priceMonthly: 999,  // $9.99
    priceYearly: 9999,  // $99.99
    // Price IDs from environment variables - NO FALLBACKS
    priceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    priceIdYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    features: [
      'Advanced analytics dashboard',
      'Custom portfolio tracking',
      'Export functionality (PDF, CSV)',
      'DCA vs Lump Sum comparison tools',
      'Shareable report links',
      'Priority processing',
      'Ad-free experience',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    // Display prices in cents for Stripe compatibility
    priceMonthly: 2999,  // $29.99
    priceYearly: 29999,  // $299.99
    // Price IDs from environment variables - NO FALLBACKS
    priceIdMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
    priceIdYearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
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

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates that a price ID exists in our configuration
 */
export function validatePriceId(priceId: string): boolean {
  const validPriceIds = [
    SUBSCRIPTION_PLANS.pro.priceIdMonthly,
    SUBSCRIPTION_PLANS.pro.priceIdYearly,
    SUBSCRIPTION_PLANS.premium.priceIdMonthly,
    SUBSCRIPTION_PLANS.premium.priceIdYearly,
  ];
  return validPriceIds.includes(priceId) && priceId !== '';
}

/**
 * Gets the tier for a given price ID
 */
export function getTierForPriceId(priceId: string): SubscriptionTier | null {
  if (
    priceId === SUBSCRIPTION_PLANS.pro.priceIdMonthly ||
    priceId === SUBSCRIPTION_PLANS.pro.priceIdYearly
  ) {
    return 'pro';
  }
  if (
    priceId === SUBSCRIPTION_PLANS.premium.priceIdMonthly ||
    priceId === SUBSCRIPTION_PLANS.premium.priceIdYearly
  ) {
    return 'premium';
  }
  return null;
}

// =============================================================================
// STRIPE API FUNCTIONS
// =============================================================================

function assertStripeConfigured(): asserts stripe is Stripe {
  if (!stripe) {
    throw new Error(
      'Stripe is not configured. Missing environment variables: ' +
      missingEnvVars.join(', ')
    );
  }
}

export async function createStripeCustomer(email: string, name?: string) {
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  
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
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  
  // Validate price ID before creating session
  if (!validatePriceId(priceId)) {
    throw new Error(`Invalid price ID: ${priceId}`);
  }
  
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
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });
}

export async function getSubscription(subscriptionId: string) {
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  
  // Validate price ID before updating
  if (!validatePriceId(priceId)) {
    throw new Error(`Invalid price ID: ${priceId}`);
  }
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return stripe.subscriptions.update(subscriptionId, {
    items: [{ id: subscription.items.data[0].id, price: priceId }],
    proration_behavior: 'create_prorations'
  });
}

// =============================================================================
// WEBHOOK HANDLING
// =============================================================================

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
  assertStripeConfigured();
  if (!stripe) throw new Error("Stripe is not configured");
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// =============================================================================
// EXPORTS FOR DEBUGGING/TESTING
// =============================================================================

export const stripeConfig = {
  isConfigured: isStripeConfigured,
  isTestMode,
  missingEnvVars,
  configuredEnvVars,
} as const;
