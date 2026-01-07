import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const subscribers: Map<string, { email: string; subscribedAt: number; tier: string }> = new Map();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, tier = 'free' } = await request.json();
    
    if (!email) {
      throw error(400, 'Email is required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw error(400, 'Invalid email format');
    }
    
    if (subscribers.has(email)) {
      return json({ 
        success: true, 
        message: 'Already subscribed',
        subscribed: true 
      });
    }
    
    subscribers.set(email, {
      email,
      subscribedAt: Date.now(),
      tier
    });
    
    return json({ 
      success: true, 
      message: 'Successfully subscribed',
      subscribed: true 
    });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Subscription failed');
  }
};

export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw error(401, 'Unauthorized');
  }
  
  return json({
    subscribed: false,
    count: subscribers.size
  });
};
