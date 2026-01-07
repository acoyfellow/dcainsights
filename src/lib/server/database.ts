export interface User {
  id: string;
  email: string;
  name?: string;
  stripeCustomerId?: string;
  subscriptionTier?: 'free' | 'pro' | 'premium';
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing';
  subscriptionPeriodEnd?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Database {
  createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByStripeCustomerId(customerId: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserSubscription(
    userId: string,
    subscription: {
      tier: User['subscriptionTier'];
      subscriptionId: string;
      status: User['subscriptionStatus'];
      periodEnd: number;
    }
  ): Promise<void>;
  getUserCount(): Promise<number>;
  getActiveSubscriberCount(): Promise<number>;
  getRevenueByPeriod(period: 'day' | 'week' | 'month' | 'year'): Promise<number>;
}

class MockDatabase implements Database {
  private users: Map<string, User> = new Map();

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = Date.now();
    const user: User = {
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.stripeCustomerId === customerId) return user;
    }
    return null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: Date.now()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  async updateUserSubscription(
    userId: string,
    subscription: {
      tier: User['subscriptionTier'];
      subscriptionId: string;
      status: User['subscriptionStatus'];
      periodEnd: number;
    }
  ): Promise<void> {
    await this.updateUser(userId, {
      subscriptionTier: subscription.tier,
      subscriptionId: subscription.subscriptionId,
      subscriptionStatus: subscription.status,
      subscriptionPeriodEnd: subscription.periodEnd
    });
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }

  async getActiveSubscriberCount(): Promise<number> {
    let count = 0;
    for (const user of this.users.values()) {
      if (user.subscriptionStatus === 'active' && user.subscriptionTier !== 'free') {
        count++;
      }
    }
    return count;
  }

  async getRevenueByPeriod(period: 'day' | 'week' | 'month' | 'year'): Promise<number> {
    return 0;
  }
}

export const db: Database = new MockDatabase();

export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
