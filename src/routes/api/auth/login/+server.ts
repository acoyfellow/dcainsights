import { json, error } from '@sveltejs/kit';
import { createUserWithSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as { email?: string; name?: string };
    const { email, name } = body;
    
    if (!email) {
      throw error(400, 'Email is required');
    }
    
    const { user, token } = await createUserWithSession(email, name);
    
    return json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.subscriptionTier
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to create account');
  }
};
