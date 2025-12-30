export const LATEST_DATASET_KEY = 'latest-dataset';

export type DatasetMetadata = {
	date: string;
	source: string;
	checksum: string;
	key: string;
	size: number;
	contentType: string;
};

export type DatasetSnapshot = {
	metadata: DatasetMetadata;
	data: unknown;
};

const DEFAULT_CONTENT_TYPE = 'application/json';

export async function fetchAndStoreDataset(
	upstreamUrl: string,
	bucket: R2Bucket,
	metadataStore: KVNamespace,
	fetcher: typeof fetch = fetch
): Promise<DatasetMetadata> {
	if (!upstreamUrl) {
		throw new Error('Missing UPSTREAM_URL configuration.');
	}

	const response = await fetcher(upstreamUrl, {
		headers: {
			'accept': DEFAULT_CONTENT_TYPE
		}
	});

	if (!response.ok) {
		throw new Error(`Upstream request failed with ${response.status}.`);
	}

	const payload = await response.json<unknown>();
	const normalized = normalizePayload(payload);
	const body = JSON.stringify(normalized);
	const checksum = await sha256(body);
	const date = new Date().toISOString();
	const key = buildSnapshotKey(date, checksum);

	await bucket.put(key, body, {
		httpMetadata: {
			contentType: DEFAULT_CONTENT_TYPE
		}
	});

	const metadata: DatasetMetadata = {
		date,
		source: upstreamUrl,
		checksum,
		key,
		size: body.length,
		contentType: DEFAULT_CONTENT_TYPE
	};

	await metadataStore.put(LATEST_DATASET_KEY, JSON.stringify(metadata));

	return metadata;
}

export async function getLatestSnapshot(
	bucket: R2Bucket,
	metadataStore: KVNamespace
): Promise<DatasetSnapshot | null> {
	const metadataRaw = await metadataStore.get(LATEST_DATASET_KEY);
	if (!metadataRaw) {
		return null;
	}

	const metadata = JSON.parse(metadataRaw) as DatasetMetadata;
	const object = await bucket.get(metadata.key);
	if (!object) {
		return null;
	}

	const text = await object.text();
	const data = JSON.parse(text) as unknown;

	return { metadata, data };
}

function normalizePayload(payload: unknown): unknown {
	if (payload === null || payload === undefined) {
		throw new Error('Upstream payload is empty.');
	}

	if (typeof payload !== 'object') {
		throw new Error('Upstream payload must be a JSON object or array.');
	}

	return normalizeValue(payload);
}

function normalizeValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((entry) => normalizeValue(entry));
	}

	if (value && typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
			a.localeCompare(b)
		);
		const normalized: Record<string, unknown> = {};
		for (const [key, entryValue] of entries) {
			normalized[key] = normalizeValue(entryValue);
		}
		return normalized;
	}

	return value;
}

function buildSnapshotKey(date: string, checksum: string): string {
	const safeDate = date.replace(/[:.]/g, '-');
	return `snapshots/${safeDate}-${checksum}.json`;
}

async function sha256(input: string): Promise<string> {
	const data = new TextEncoder().encode(input);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
