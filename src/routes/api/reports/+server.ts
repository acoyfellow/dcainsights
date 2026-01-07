import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory fallback for local development without KV
const inMemoryReports = new Map<string, { data: object; createdAt: number }>();

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const { id, data } = await request.json();

    if (!id || !data) {
      throw error(400, 'Report ID and data are required');
    }

    const reportData = {
      data,
      createdAt: Date.now(),
    };

    // Try to use KV if available (production)
    if (platform && 'env' in platform && (platform as { env: Record<string, unknown> }).env.REPORTS_KV) {
      const kv = (platform as { env: { REPORTS_KV: { put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void> } } }).env.REPORTS_KV;
      await kv.put(id, JSON.stringify(reportData), {
        expirationTtl: 30 * 24 * 60 * 60, // 30 days
      });
    } else {
      // Fallback for local development
      inMemoryReports.set(id, reportData);
    }

    return json({ success: true, id });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    console.error('Failed to save report:', err);
    throw error(500, 'Failed to save report');
  }
};

export const GET: RequestHandler = async ({ url, platform }) => {
  try {
    const id = url.searchParams.get('id');

    if (!id) {
      throw error(400, 'Report ID is required');
    }

    let reportData: { data: object; createdAt: number } | null = null;

    // Try to use KV if available (production)
    if (platform && 'env' in platform && (platform as { env: Record<string, unknown> }).env.REPORTS_KV) {
      const kv = (platform as { env: { REPORTS_KV: { get: (key: string) => Promise<string | null> } } }).env.REPORTS_KV;
      const stored = await kv.get(id);
      if (stored) {
        reportData = JSON.parse(stored);
      }
    } else {
      // Fallback for local development
      reportData = inMemoryReports.get(id) || null;
    }

    if (!reportData) {
      throw error(404, 'Report not found');
    }

    return json({ success: true, ...reportData });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    console.error('Failed to load report:', err);
    throw error(500, 'Failed to load report');
  }
};
