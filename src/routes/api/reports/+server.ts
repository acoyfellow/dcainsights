import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory storage for shareable reports
// NOTE: For production persistence across deployments, add Cloudflare KV:
// 1. Create token with KV permissions at https://dash.cloudflare.com/profile/api-tokens
// 2. Run: npx wrangler kv:namespace create "REPORTS_KV"
// 3. Update wrangler.jsonc with the namespace binding
const inMemoryReports = new Map<string, { data: object; createdAt: number }>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { id, data } = await request.json();

    if (!id || !data) {
      throw error(400, 'Report ID and data are required');
    }

    const reportData = {
      data,
      createdAt: Date.now(),
    };

    // Store in memory (per-deployment instance)
    inMemoryReports.set(id, reportData);

    return json({ success: true, id });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    console.error('Failed to save report:', err);
    throw error(500, 'Failed to save report');
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');

    if (!id) {
      throw error(400, 'Report ID is required');
    }

    const reportData = inMemoryReports.get(id);

    if (!reportData) {
      throw error(404, 'Report not found or expired');
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
