import { getSp500Dataset } from '$lib/server/sp500Dataset';

export async function load() {
  const { parsedData, metadata } = getSp500Dataset();

  if (!parsedData.length) {
    return {
      parsedData: [],
      bearMarketPeriods: [],
      metadata
    };
  }

  try {
    const sortedData = [...parsedData].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Identify bear market periods (20%+ decline from recent peak)
    const bearMarketPeriods: Array<{
      start: string;
      end: string;
      peakValue: number;
      troughValue: number;
      decline: number;
      duration: number;
      name: string;
    }> = [];

    let currentPeak = sortedData[0].value;
    let currentPeakDate = sortedData[0].date;
    let inBearMarket = false;
    let bearStartDate = '';
    let bearStartValue = 0;

    for (let i = 1; i < sortedData.length; i++) {
      const current = sortedData[i];

      // Update peak if we hit a new high
      if (current.value > currentPeak) {
        currentPeak = current.value;
        currentPeakDate = current.date;

        // If we were in a bear market and hit a new high, bear market is over
        if (inBearMarket) {
          const prevData = sortedData[i - 1];
          const durationDays = Math.floor((new Date(prevData.date).getTime() - new Date(bearStartDate).getTime()) / (1000 * 60 * 60 * 24));

          bearMarketPeriods.push({
            start: bearStartDate,
            end: prevData.date,
            peakValue: bearStartValue,
            troughValue: Math.min(...sortedData.slice(
              sortedData.findIndex(d => d.date === bearStartDate),
              i
            ).map(d => d.value)),
            decline: ((bearStartValue - Math.min(...sortedData.slice(
              sortedData.findIndex(d => d.date === bearStartDate),
              i
            ).map(d => d.value))) / bearStartValue) * 100,
            duration: durationDays,
            name: `Bear Market ${bearMarketPeriods.length + 1}`
          });

          inBearMarket = false;
        }
      }

      // Check if we're entering a bear market (20% down from peak)
      const declineFromPeak = ((currentPeak - current.value) / currentPeak) * 100;

      if (declineFromPeak >= 20 && !inBearMarket) {
        inBearMarket = true;
        bearStartDate = currentPeakDate;
        bearStartValue = currentPeak;
      }
    }

    // Handle case where bear market extends to end of data
    if (inBearMarket) {
      const lastData = sortedData[sortedData.length - 1];
      const durationDays = Math.floor((new Date(lastData.date).getTime() - new Date(bearStartDate).getTime()) / (1000 * 60 * 60 * 24));

      bearMarketPeriods.push({
        start: bearStartDate,
        end: lastData.date,
        peakValue: bearStartValue,
        troughValue: Math.min(...sortedData.slice(
          sortedData.findIndex(d => d.date === bearStartDate)
        ).map(d => d.value)),
        decline: ((bearStartValue - Math.min(...sortedData.slice(
          sortedData.findIndex(d => d.date === bearStartDate)
        ).map(d => d.value))) / bearStartValue) * 100,
        duration: durationDays,
        name: `Bear Market ${bearMarketPeriods.length + 1}`
      });
    }

    // Add major historical bear market names based on dates
    bearMarketPeriods.forEach(period => {
      const startYear = new Date(period.start).getFullYear();
      if (startYear >= 2000 && startYear <= 2002) {
        period.name = "Dot-com Crash (2000-2002)";
      } else if (startYear >= 2007 && startYear <= 2009) {
        period.name = "Financial Crisis (2007-2009)";
      } else if (startYear >= 2020 && startYear <= 2020) {
        period.name = "COVID-19 Pandemic (2020)";
      } else if (startYear >= 2022) {
        period.name = "Inflation/Rate Hikes (2022)";
      }
    });

    return {
      parsedData: sortedData,
      bearMarketPeriods,
      metadata
    };
  } catch (error) {
    console.error('Error building bear market data:', error);
    return {
      parsedData,
      bearMarketPeriods: [],
      metadata
    };
  }
}
