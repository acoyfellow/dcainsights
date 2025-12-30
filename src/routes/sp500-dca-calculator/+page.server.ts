import { getSp500Dataset } from '$lib/server/sp500Dataset';

export async function load() {
  const { parsedData, metadata } = getSp500Dataset();

  if (!parsedData.length) {
    return {
      parsedData: [],
      metadata
    };
  }

  return {
    parsedData,
    metadata
  };
}
