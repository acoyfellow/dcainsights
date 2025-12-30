import { getSp500Dataset } from '$lib/server/sp500Dataset';

export async function load() {
  const { parsedData, metadata } = getSp500Dataset();

  if (!parsedData.length) {
    return {
      parsedData: [],
      metadata
    };
  }

  const sortedData = [...parsedData].sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    parsedData: sortedData,
    metadata
  };
}
