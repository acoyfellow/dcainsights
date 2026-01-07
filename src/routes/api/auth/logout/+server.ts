import { json } from '@sveltejs/kit';
import { destroySession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (token) {
    destroySession(token);
  }
  
  return json({ success: true });
};
