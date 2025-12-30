import { json, error } from '@sveltejs/kit';
import { getLatestSnapshot } from '$lib/server/dataset';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const env = platform?.env;
	if (!env) {
		throw error(500, 'Cloudflare bindings are unavailable.');
	}

	const snapshot = await getLatestSnapshot(env.DATASETS_BUCKET, env.DATASET_METADATA);
	if (!snapshot) {
		throw error(404, 'Dataset metadata not found.');
	}

	return json(snapshot, {
		headers: {
			'cache-control': 'public, max-age=60'
		}
	});
};
