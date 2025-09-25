import csvData from '../../../static/s&p-500.csv?raw';


export async function load() {
  try {
    const rows = csvData.trim().split("\n");
    const headers = rows
      .shift()
      ?.split(",")
      .map((h) => h.trim().replace(/\r/g, ""));

    if (!headers) return { data: [] };

    const parsedData = rows
      .map((row) => {
        const values = row.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header] = index === 1 ? parseFloat(values[index]) : values[index];
          return obj;
        }, {});
      })
      .filter((row) => !isNaN(row.value));

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