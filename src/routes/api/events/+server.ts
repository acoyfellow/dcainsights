import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory event log for local development
const eventLog: Array<{ type: string; data: object; timestamp: number; sessionId?: string }> = [];

// Event types for type safety
type EventType = 'view_tool' | 'export_click' | 'checkout_start' | 'purchase' | 'page_view';

interface EventPayload {
  type: EventType;
  tool?: string;
  userId?: string;
  tier?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const payload: EventPayload = await request.json();

    if (!payload.type) {
      throw error(400, 'Event type is required');
    }

    const event = {
      type: payload.type,
      data: payload,
      timestamp: Date.now(),
      sessionId: payload.metadata?.sessionId as string | undefined,
    };

    // Try to use KV if available (production)
    if (platform && 'env' in platform && (platform as { env: Record<string, unknown> }).env.REPORTS_KV) {
      const kv = (platform as { env: { REPORTS_KV: { put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void> } } }).env.REPORTS_KV;
      const eventKey = `event:${event.timestamp}:${Math.random().toString(36).slice(2)}`;
      await kv.put(eventKey, JSON.stringify(event), {
        expirationTtl: 30 * 24 * 60 * 60, // 30 days
      });
    } else {
      // Fallback for local development - keep last 1000 events
      eventLog.push(event);
      if (eventLog.length > 1000) {
        eventLog.shift();
      }
    }

    return json({ success: true });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    console.error('Failed to log event:', err);
    throw error(500, 'Failed to log event');
  }
};

// Get events (for admin/debugging)
export const GET: RequestHandler = async ({ url, platform }) => {
  try {
    const eventType = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let events: Array<{ type: string; data: object; timestamp: number; sessionId?: string }> = [];

    // Try to use KV if available (production)
    if (platform && 'env' in platform && (platform as { env: Record<string, unknown> }).env.REPORTS_KV) {
      // For production, we would need to list keys - simplified for now
      // In a real implementation, you'd use KV's list operation with a prefix
      return json({ 
        success: true, 
        events: [],
        message: 'KV event listing not implemented - check Cloudflare dashboard for KV data'
      });
    } else {
      // Fallback for local development
      events = eventLog
        .filter(e => !eventType || e.type === eventType)
        .slice(-limit)
        .reverse();
    }

    return json({ success: true, events });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    console.error('Failed to get events:', err);
    throw error(500, 'Failed to get events');
  }
};
