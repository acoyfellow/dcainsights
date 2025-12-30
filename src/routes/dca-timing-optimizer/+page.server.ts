import { loadMarketData } from '$lib/server/marketData';

export async function load() {
  try {
    const parsedData = loadMarketData({ sortByDate: true });

    return {
      parsedData
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return {
      data: []
    };
  }
}
