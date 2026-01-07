import { json, error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw error(401, 'Unauthorized');
    }
    
    const session = await validateSession(token);
    if (!session) {
      throw error(401, 'Invalid session');
    }
    
    return json({
      id: session.userId,
      email: session.email,
      tier: session.tier
    });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to get user');
  }
};
