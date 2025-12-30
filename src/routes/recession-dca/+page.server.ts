import { getSp500Dataset } from '$lib/server/sp500Dataset';

export async function load() {
  const { parsedData, metadata } = getSp500Dataset();

  if (!parsedData.length) {
    return {
      parsedData: [],
      recessionPeriods: [],
      recessionStats: [],
      metadata
    };
  }

  try {
    const sortedData = [...parsedData].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Official US Recession Periods (NBER dates)
    const recessionPeriods = [
      {
        name: "Early 1990s Recession",
        start: "1990-07-01",
        end: "1991-03-31",
        description: "Caused by Iraqi invasion of Kuwait, oil price shock, and S&L crisis",
        duration: 8, // months
        severity: "Moderate"
      },
      {
        name: "Dot-com Recession",
        start: "2001-03-01",
        end: "2001-11-30",
        description: "Technology bubble burst, 9/11 attacks, corporate accounting scandals",
        duration: 8,
        severity: "Mild"
      },
      {
        name: "Great Recession",
        start: "2007-12-01",
        end: "2009-06-30",
        description: "Subprime mortgage crisis, financial sector collapse, global banking crisis",
        duration: 18,
        severity: "Severe"
      },
      {
        name: "COVID-19 Recession",
        start: "2020-02-01",
        end: "2020-04-30",
        description: "Global pandemic, widespread business closures, unprecedented economic shutdown",
        duration: 2,
        severity: "Sharp but Brief"
      }
    ];

    // Filter recession periods to those covered by our data
    const dataStartDate = new Date(sortedData[0].date);
    const dataEndDate = new Date(sortedData[sortedData.length - 1].date);

    const availableRecessions = recessionPeriods.filter(recession => {
      const recessionStart = new Date(recession.start);
      const recessionEnd = new Date(recession.end);
      return recessionStart >= dataStartDate && recessionEnd <= dataEndDate;
    });

    // Calculate recession statistics
    const recessionStats = availableRecessions.map(recession => {
      const recessionStart = new Date(recession.start);
      const recessionEnd = new Date(recession.end);

      // Get S&P 500 data for recession period
      const recessionData = sortedData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= recessionStart && itemDate <= recessionEnd;
      });

      if (recessionData.length === 0) return null;

      // Find data points closest to start and end
      const startPrice = sortedData.find((item: any) => new Date(item.date) >= recessionStart)?.value || 0;
      const endPrice = sortedData.find((item: any) => new Date(item.date) >= recessionEnd)?.value || 0;

      const priceChange = ((endPrice - startPrice) / startPrice) * 100;

      // Get min/max during recession
      const minPrice = Math.min(...recessionData.map((d: any) => d.value));
      const maxPrice = Math.max(...recessionData.map((d: any) => d.value));

      return {
        ...recession,
        startPrice: startPrice.toFixed(2),
        endPrice: endPrice.toFixed(2),
        priceChange: priceChange.toFixed(2),
        minPrice: minPrice.toFixed(2),
        maxPrice: maxPrice.toFixed(2),
        maxDrawdown: (((startPrice - minPrice) / startPrice) * 100).toFixed(2)
      };
    }).filter(Boolean);

    return {
      parsedData: sortedData,
      recessionPeriods: availableRecessions,
      recessionStats,
      metadata
    };
  } catch (error) {
    console.error('Error building recession data:', error);
    return {
      parsedData,
      recessionPeriods: [],
      recessionStats: [],
      metadata
    };
  }
}
