import csvData from '../../../static/s&p-500.csv?raw';

type Sp500Row = {
  date: string;
  value: number;
  [key: string]: string | number;
};

type Sp500Metadata = {
  lastUpdated: string;
  source: string;
};

const SOURCE = 'MacroTrends S&P 500 Historical Data';

let cachedParsedData: Sp500Row[] | null = null;
let cachedMetadata: Sp500Metadata | null = null;

const EMPTY_METADATA: Sp500Metadata = {
  lastUpdated: '',
  source: SOURCE,
};

const parseCsv = (rawData: string): Sp500Row[] => {
  const rows = rawData.trim().split('\n');
  const headers = rows
    .shift()
    ?.split(',')
    .map((header) => header.trim().replace(/\r/g, ''));

  if (!headers) {
    throw new Error('Missing CSV headers for S&P 500 dataset.');
  }

  return rows
    .map((row) => {
      const values = row.split(',');
      return headers.reduce((obj: Sp500Row, header, index) => {
        obj[header] = index === 1 ? parseFloat(values[index]) : values[index];
        return obj;
      }, {} as Sp500Row);
    })
    .filter((row) => !isNaN(row.value));
};

const buildMetadata = (parsedData: Sp500Row[]): Sp500Metadata => {
  if (!parsedData.length) {
    return { ...EMPTY_METADATA };
  }

  const latestDate = parsedData.reduce((latest, row) => {
    return new Date(row.date) > new Date(latest) ? row.date : latest;
  }, parsedData[0].date);

  return {
    lastUpdated: latestDate,
    source: SOURCE,
  };
};

export const getSp500Dataset = () => {
  try {
    const parsedData = parseCsv(csvData);
    const metadata = buildMetadata(parsedData);

    cachedParsedData = parsedData;
    cachedMetadata = metadata;

    return { parsedData, metadata };
  } catch (error) {
    console.error('Failed to parse S&P 500 dataset:', error);

    if (cachedParsedData) {
      console.warn('Falling back to previously cached S&P 500 dataset.');
      return {
        parsedData: cachedParsedData,
        metadata: cachedMetadata ?? EMPTY_METADATA,
      };
    }

    return { parsedData: [], metadata: EMPTY_METADATA };
  }
};
