import csvData from '../../../static/s&p-500.csv?raw';

export interface MarketDataRow {
  date: string;
  value: number;
  [key: string]: string | number;
}

interface MarketDataOptions {
  sortByDate?: boolean;
}

export const loadMarketData = (options: MarketDataOptions = {}): MarketDataRow[] => {
  const rows = csvData.trim().split('\n');
  const headers = rows
    .shift()
    ?.split(',')
    .map((header) => header.trim().replace(/\r/g, ''));

  if (!headers) return [];

  const parsedData = rows
    .map((row) => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = index === 1 ? parseFloat(values[index]) : values[index];
        return obj;
      }, {} as MarketDataRow);
    })
    .filter((row) => !isNaN(row.value));

  if (options.sortByDate) {
    parsedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return parsedData;
};
