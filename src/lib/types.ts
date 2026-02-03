// Affiliate partner types - safe to use anywhere
export type AffiliatePartner = {
  id: string;
  name: string;
  description: string;
  url: string;
  commission: number;
  category: 'brokerage' | 'tool' | 'content' | 'financial';
  affiliateCode?: string;
  status: 'active' | 'inactive';
  createdAt: number;
};

// Static affiliate partner data - safe to expose
export const affiliatePartnersData: AffiliatePartner[] = [
  {
    id: 'robinhood',
    name: 'Robinhood',
    description: 'Commission-free stock, ETF, and cryptocurrency trading',
    url: 'https://www.robinhood.com/',
    commission: 2.5,
    category: 'brokerage',
    status: 'active',
    createdAt: Date.now()
  },
  {
    id: 'fidelity',
    name: 'Fidelity Investments',
    description: 'Full-service brokerage with zero-commission online stock trading',
    url: 'https://www.fidelity.com/',
    commission: 3.0,
    category: 'brokerage',
    status: 'active',
    createdAt: Date.now()
  },
  {
    id: 'schwab',
    name: 'Charles Schwab',
    description: 'One of the largest brokerage firms with extensive resources',
    url: 'https://www.schwab.com/',
    commission: 3.0,
    category: 'brokerage',
    status: 'active',
    createdAt: Date.now()
  },
  {
    id: 'acorns',
    name: 'Acorns',
    description: 'Micro-investing app that rounds up purchases to invest',
    url: 'https://www.acorns.com/',
    commission: 5.0,
    category: 'tool',
    status: 'active',
    createdAt: Date.now()
  },
  {
    id: 'personal-capital',
    name: 'Personal Capital',
    description: 'Free financial tools and advisory services',
    url: 'https://www.personalcapital.com/',
    commission: 4.0,
    category: 'tool',
    status: 'active',
    createdAt: Date.now()
  }
];

// Subscription plan types - safe to use anywhere
export type SubscriptionTier = 'pro' | 'premium';

export interface SubscriptionPlan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  priceIdMonthly: string;
  priceIdYearly: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: { pro: SubscriptionPlan; premium: SubscriptionPlan } = {
  pro: {
    name: 'Pro',
    priceMonthly: 999,
    priceYearly: 9900,
    priceIdMonthly: 'price_pro_monthly',
    priceIdYearly: 'price_pro_yearly',
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
    priceIdMonthly: 'price_premium_monthly',
    priceIdYearly: 'price_premium_yearly',
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

// Course types
export type CourseTier = 'pro' | 'premium';
export type UserTier = 'free' | 'pro' | 'premium';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  tier: CourseTier;
  price: number;
  billingMonthly: string;
  duration: string;
  lessons: number;
  description: string;
  objectives: string[];
  thumbnail: string;
  instructor: string;
  level: CourseLevel;
  tags: string[];
}

export interface LessonResource {
  title: string;
  type: 'pdf' | 'xlsx' | 'video' | 'link';
  url: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: number;
  order: number;
  videoUrl: string;
  transcriptUrl: string;
  resources: LessonResource[];
  objectives: string[];
  description: string;
}

export interface UserProgress {
  odUserId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  watchedSeconds: number;
  lastWatchedAt: number;
  completedAt?: number;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  lessonsCompleted: number;
  totalLessons: number;
  percentComplete: number;
  lastAccessedAt: number;
}

export interface CoursesData {
  courses: Course[];
}

export interface LessonsData {
  lessons: Lesson[];
}
