import { handler } from './handler';
import { fetchAndStoreDataset } from './lib/server/dataset';

export default {
	fetch: handler,
	async scheduled(event, env, ctx) {
		const scheduledAt = new Date(event.scheduledTime).toISOString();
		ctx.waitUntil(
			fetchAndStoreDataset(env.UPSTREAM_URL, env.DATASETS_BUCKET, env.DATASET_METADATA).catch(
				(error) => {
					console.error(`Scheduled sync failed at ${scheduledAt}.`, error);
				}
			)
		);
	}
} satisfies ExportedHandler<Env>;
