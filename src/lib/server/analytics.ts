// Analytics tracking for DCA Insights

export interface AnalyticsEvent {
  type: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, any>;
  timestamp: number;
}

// Event types
export const EVENTS = {
  PAGE_VIEW: 'page_view',
  CALCULATOR_USED: 'calculator_used',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  AFFILIATE_CLICK: 'affiliate_click',
  AFFILIATE_CONVERSION: 'affiliate_conversion',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  COURSE_STARTED: 'course_started',
  COURSE_COMPLETED: 'course_completed',
  EXPORT_DATA: 'export_data',
  SHARE_RESULT: 'share_result'
} as const;

// Track an event
export function trackEvent(event: AnalyticsEvent): void {
  // In production, send to analytics service (Mixpanel, Amplitude, etc.)
  console.log('Analytics Event:', JSON.stringify(event));
}

// Page view tracking helper
export function trackPageView(
  page: string,
  userId?: string,
  sessionId?: string,
  properties?: Record<string, any>
): void {
  trackEvent({
    type: EVENTS.PAGE_VIEW,
    userId,
    sessionId,
    properties: { page, ...properties },
    timestamp: Date.now()
  });
}

// Calculator usage tracking
export function trackCalculatorUsage(
  calculator: string,
  userId?: string,
  sessionId?: string,
  properties?: Record<string, any>
): void {
  trackEvent({
    type: EVENTS.CALCULATOR_USED,
    userId,
    sessionId,
    properties: { calculator, ...properties },
    timestamp: Date.now()
  });
}

// Subscription event tracking
export function trackSubscription(
  action: 'started' | 'canceled' | 'upgraded' | 'downgraded',
  tier: string,
  userId?: string,
  properties?: Record<string, any>
): void {
  trackEvent({
    type: action === 'started' ? EVENTS.SUBSCRIPTION_STARTED : EVENTS.SUBSCRIPTION_CANCELED,
    userId,
    properties: { tier, action, ...properties },
    timestamp: Date.now()
  });
}

// Revenue tracking
export interface RevenueEvent {
  userId: string;
  amount: number;
  currency: string;
  tier: string;
  interval: 'monthly' | 'yearly';
  type: 'subscription' | 'course' | 'one-time';
}

export function trackRevenue(event: RevenueEvent): void {
  // In production, send to analytics and revenue tracking system
  console.log('Revenue Event:', JSON.stringify(event));
}

// User funnel tracking
export interface FunnelStep {
  name: string;
  stepNumber: number;
  totalSteps: number;
}

export function trackFunnelStep(
  funnel: string,
  step: FunnelStep,
  userId?: string,
  sessionId?: string
): void {
  trackEvent({
    type: 'funnel_step',
    userId,
    sessionId,
    properties: {
      funnel,
      ...step,
      completedPercentage: (step.stepNumber / step.totalSteps) * 100
    },
    timestamp: Date.now()
  });
}

// A/B test tracking
export function trackExperiment(
  experimentId: string,
  variant: string,
  userId?: string
): void {
  trackEvent({
    type: 'experiment_viewed',
    userId,
    properties: { experimentId, variant },
    timestamp: Date.now()
  });
}

// Error tracking
export function trackError(
  error: string,
  stack?: string,
  userId?: string,
  properties?: Record<string, any>
): void {
  trackEvent({
    type: 'error',
    userId,
    properties: { error, stack, ...properties },
    timestamp: Date.now()
  });
}

// Get analytics dashboard data
export function getAnalyticsDashboard(): {
  totalUsers: number;
  activeUsers: number;
  revenue: {
    mrr: number;
    arr: number;
    total: number;
  };
  conversions: {
    freeToPro: number;
    freeToPremium: number;
    churnRate: number;
  };
  topCalculators: { name: string; uses: number }[];
  affiliateRevenue: number;
  newsletterSubscribers: number;
} {
  // Mock data - in production, query from analytics database
  return {
    totalUsers: 1523,
    activeUsers: 892,
    revenue: {
      mrr: 2450,
      arr: 29400,
      total: 45800
    },
    conversions: {
      freeToPro: 4.2,
      freeToPremium: 1.8,
      churnRate: 2.1
    },
    topCalculators: [
      { name: 'S&P 500 DCA Calculator', uses: 4521 },
      { name: 'DCA vs Lump Sum', uses: 2847 },
      { name: 'Bear Market Analysis', uses: 1923 },
      { name: 'DCA Timing Optimizer', uses: 1456 }
    ],
    affiliateRevenue: 1234.56,
    newsletterSubscribers: 5123
  };
}
