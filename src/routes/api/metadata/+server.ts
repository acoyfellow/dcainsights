import { json } from '@sveltejs/kit';
import { getSp500Dataset } from '$lib/server/sp500Dataset';

export const GET = () => {
  const { metadata } = getSp500Dataset();

  return json({
    lastUpdated: metadata.lastUpdated,
    source: metadata.source
  });
};
