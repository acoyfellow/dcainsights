import { db, generateUserId, normalizeEmail } from './database';

export interface AuthSession {
  userId: string;
  email: string;
  tier: 'free' | 'pro' | 'premium';
  expiresAt: number;
}

const sessions: Map<string, AuthSession> = new Map();

export function generateSessionToken(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export async function createUserWithSession(email: string, name?: string) {
  const normalizedEmail = normalizeEmail(email);
  
  const existingUser = await db.getUserByEmail(normalizedEmail);
  if (existingUser) {
    const token = generateSessionToken();
    const session: AuthSession = {
      userId: existingUser.id,
      email: normalizedEmail,
      tier: existingUser.subscriptionTier || 'free',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    };
    sessions.set(token, session);
    return { user: existingUser, token };
  }
  
  const user = await db.createUser({
    id: generateUserId(),
    email: normalizedEmail,
    name: name || undefined,
    subscriptionTier: 'free'
  });
  
  const token = generateSessionToken();
  const authSession: AuthSession = {
    userId: user.id,
    email: normalizedEmail,
    tier: 'free',
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  };
  sessions.set(token, authSession);
  
  return { user, token };
}

export async function validateSession(token: string): Promise<AuthSession | null> {
  const session = sessions.get(token);
  if (!session) return null;
  
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  
  session.expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  
  const user = await db.getUserById(session.userId);
  if (user) {
    session.tier = user.subscriptionTier || 'free';
  }
  
  return session;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export async function getUserFromSession(token: string) {
  const session = await validateSession(token);
  if (!session) return null;
  
  return db.getUserById(session.userId);
}

export function hasPremiumAccess(tier: string): boolean {
  return tier === 'pro' || tier === 'premium';
}

export function getUserTier(session: AuthSession | null): 'free' | 'pro' | 'premium' {
  return session?.tier || 'free';
}

export function canAccessFeature(tier: 'free' | 'pro' | 'premium', feature: string): boolean {
  const freeFeatures = [
    'basic-calculator',
    'share-results'
  ];
  
  const proFeatures = [
    ...freeFeatures,
    'advanced-analytics',
    'custom-portfolio',
    'export-data',
    'priority-processing'
  ];
  
  const premiumFeatures = [
    ...proFeatures,
    'backtesting',
    'strategy-advisor',
    'api-access',
    'premium-content'
  ];
  
  switch (tier) {
    case 'free':
      return freeFeatures.includes(feature);
    case 'pro':
      return proFeatures.includes(feature);
    case 'premium':
      return premiumFeatures.includes(feature);
    default:
      return false;
  }
}

export async function updateUserTier(userId: string, tier: 'free' | 'pro' | 'premium') {
  await db.updateUser(userId, { subscriptionTier: tier });
  
  for (const [token, session] of sessions.entries()) {
    if (session.userId === userId) {
      session.tier = tier;
    }
  }
}
