<script lang="ts">
  import { page } from "$app/state";
  import { Share } from "lucide-svelte";
  import { addToast } from "$lib/state.svelte";

  let { data } = $props();

  // Analysis results
  let timingAnalysis = $derived.by(() => {
    if (!data.parsedData?.length) return null;

    const investmentAmount = 100; // Standard amount for comparison

    // Day of Month Analysis (1-31)
    const dayOfMonthResults = Array.from({ length: 31 }, (_, i) => {
      const dayOfMonth = i + 1;
      let totalShares = 0;
      let totalInvested = 0;
      let investmentCount = 0;

      const dayData = data.parsedData.filter((item: any) => {
        const date = new Date(item.date);
        return date.getDate() === dayOfMonth;
      });

      if (dayData.length < 12) return null; // Need at least 1 year of data

      dayData.forEach((item: any) => {
        const shares = investmentAmount / item.value;
        totalShares += shares;
        totalInvested += investmentAmount;
        investmentCount++;
      });

      const avgCost = totalInvested / totalShares;
      const finalValue =
        totalShares * data.parsedData[data.parsedData.length - 1].value;
      const totalReturn = ((finalValue - totalInvested) / totalInvested) * 100;
      const annualizedReturn =
        Math.pow(finalValue / totalInvested, 1 / (investmentCount / 12)) - 1;

      return {
        day: dayOfMonth,
        totalShares: totalShares.toFixed(4),
        totalInvested,
        avgCost: avgCost.toFixed(2),
        finalValue: finalValue.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
        annualizedReturn: (annualizedReturn * 100).toFixed(2),
        investmentCount,
      };
    }).filter(Boolean);

    // Day of Week Analysis (0=Sunday, 1=Monday, etc.)
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeekResults = Array.from({ length: 7 }, (_, i) => {
      let totalShares = 0;
      let totalInvested = 0;
      let investmentCount = 0;

      const dayData = data.parsedData.filter((item: any) => {
        const date = new Date(item.date);
        return date.getDay() === i;
      });

      if (dayData.length < 52) return null; // Need at least 1 year of data

      dayData.forEach((item: any) => {
        const shares = investmentAmount / item.value;
        totalShares += shares;
        totalInvested += investmentAmount;
        investmentCount++;
      });

      const avgCost = totalInvested / totalShares;
      const finalValue =
        totalShares * data.parsedData[data.parsedData.length - 1].value;
      const totalReturn = ((finalValue - totalInvested) / totalInvested) * 100;
      const annualizedReturn =
        Math.pow(finalValue / totalInvested, 1 / (investmentCount / 52)) - 1;

      return {
        dayName: dayNames[i],
        day: i,
        totalShares: totalShares.toFixed(4),
        totalInvested,
        avgCost: avgCost.toFixed(2),
        finalValue: finalValue.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
        annualizedReturn: (annualizedReturn * 100).toFixed(2),
        investmentCount,
      };
    }).filter(Boolean);

    // Find optimal days
    const bestDayOfMonth = dayOfMonthResults.reduce((best, current) =>
      parseFloat(current.totalReturn) > parseFloat(best.totalReturn)
        ? current
        : best
    );

    const worstDayOfMonth = dayOfMonthResults.reduce((worst, current) =>
      parseFloat(current.totalReturn) < parseFloat(worst.totalReturn)
        ? current
        : worst
    );

    const bestDayOfWeek = dayOfWeekResults.reduce((best, current) =>
      parseFloat(current.totalReturn) > parseFloat(best.totalReturn)
        ? current
        : best
    );

    const worstDayOfWeek = dayOfWeekResults.reduce((worst, current) =>
      parseFloat(current.totalReturn) < parseFloat(worst.totalReturn)
        ? current
        : worst
    );

    // Calculate statistics
    const monthlyReturns = dayOfMonthResults.map((d) =>
      parseFloat(d.totalReturn)
    );
    const weeklyReturns = dayOfWeekResults.map((d) =>
      parseFloat(d.totalReturn)
    );

    const monthlyStdDev = Math.sqrt(
      monthlyReturns.reduce((sum, ret) => {
        const mean =
          monthlyReturns.reduce((a, b) => a + b) / monthlyReturns.length;
        return sum + Math.pow(ret - mean, 2);
      }, 0) / monthlyReturns.length
    );

    const weeklyStdDev = Math.sqrt(
      weeklyReturns.reduce((sum, ret) => {
        const mean =
          weeklyReturns.reduce((a, b) => a + b) / weeklyReturns.length;
        return sum + Math.pow(ret - mean, 2);
      }, 0) / weeklyReturns.length
    );

    return {
      dayOfMonthResults: dayOfMonthResults.sort(
        (a, b) => parseFloat(b.totalReturn) - parseFloat(a.totalReturn)
      ),
      dayOfWeekResults: dayOfWeekResults.sort(
        (a, b) => parseFloat(b.totalReturn) - parseFloat(a.totalReturn)
      ),
      bestDayOfMonth,
      worstDayOfMonth,
      bestDayOfWeek,
      worstDayOfWeek,
      monthlyStdDev: monthlyStdDev.toFixed(2),
      weeklyStdDev: weeklyStdDev.toFixed(2),
      dataPoints: data.parsedData.length,
      dateRange: {
        start: data.parsedData[0].date,
        end: data.parsedData[data.parsedData.length - 1].date,
      },
    };
  });

  async function copyShareUrl() {
    try {
      const url = `${page.url.origin}${page.url.pathname}`;
      if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(url);
        addToast("URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to copy URL:", error);
      addToast("Failed to copy URL to clipboard", "error");
    }
  }
</script>

<svelte:head>
  <title>DCA Timing Optimizer - S&P 500 Investment Day Analysis</title>
  <meta
    name="description"
    content="Statistical analysis of optimal investment timing for Dollar Cost Averaging. Discover which days of the month and week historically produced the best DCA returns in the S&P 500."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="flex items-center justify-between pb-4">
    <div>
      <h1 class="text-2xl font-medium text-gray-900 mb-2">
        DCA Timing Optimization Analysis
      </h1>
      <p class="text-sm text-gray-600">
        S&P 500 Investment Day Performance Study
      </p>
    </div>
    <button
      onclick={copyShareUrl}
      class="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
    >
      <span>Share Analysis</span>
      <Share class="w-4 h-4" />
    </button>
  </div>

  <div class="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400">
    <p class="text-sm text-blue-800 leading-relaxed">
      This study analyzes the historical performance of Dollar Cost Averaging
      based on investment timing. Using actual S&P 500 data, we examine whether
      specific days of the month or week have consistently produced superior
      returns, helping investors optimize their systematic investment schedules.
    </p>
  </div>

  {#if timingAnalysis}
    <div class="space-y-8">
      <!-- Key Findings Summary -->
      <div class="bg-white border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Key Findings Summary
          </h2>
        </div>

        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Day of Month Findings -->
            <div class="bg-green-50 border border-green-200 p-4">
              <h3 class="font-medium text-green-800 mb-3">
                Optimal Day of Month
              </h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-green-700">Best Day:</span>
                  <span class="font-medium"
                    >{timingAnalysis.bestDayOfMonth.day}{timingAnalysis
                      .bestDayOfMonth.day === 1
                      ? "st"
                      : timingAnalysis.bestDayOfMonth.day === 2
                        ? "nd"
                        : timingAnalysis.bestDayOfMonth.day === 3
                          ? "rd"
                          : "th"} of month</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-green-700">Total Return:</span>
                  <span class="font-medium"
                    >{timingAnalysis.bestDayOfMonth.totalReturn}%</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-green-700">Average Cost:</span>
                  <span class="font-medium"
                    >${timingAnalysis.bestDayOfMonth.avgCost}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-green-700">Worst Day:</span>
                  <span class="font-medium"
                    >{timingAnalysis.worstDayOfMonth.day}{timingAnalysis
                      .worstDayOfMonth.day === 1
                      ? "st"
                      : timingAnalysis.worstDayOfMonth.day === 2
                        ? "nd"
                        : timingAnalysis.worstDayOfMonth.day === 3
                          ? "rd"
                          : "th"} ({timingAnalysis.worstDayOfMonth
                      .totalReturn}%)</span
                  >
                </div>
              </div>
            </div>

            <!-- Day of Week Findings -->
            <div class="bg-blue-50 border border-blue-200 p-4">
              <h3 class="font-medium text-blue-800 mb-3">
                Optimal Day of Week
              </h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-blue-700">Best Day:</span>
                  <span class="font-medium"
                    >{timingAnalysis.bestDayOfWeek.dayName}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Total Return:</span>
                  <span class="font-medium"
                    >{timingAnalysis.bestDayOfWeek.totalReturn}%</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Average Cost:</span>
                  <span class="font-medium"
                    >${timingAnalysis.bestDayOfWeek.avgCost}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Worst Day:</span>
                  <span class="font-medium"
                    >{timingAnalysis.worstDayOfWeek.dayName} ({timingAnalysis
                      .worstDayOfWeek.totalReturn}%)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Statistical Significance -->
          <div class="mt-6 p-4 bg-gray-50 border border-gray-200">
            <h3 class="text-sm font-medium text-gray-900 mb-3">
              Statistical Analysis
            </h3>
            <div class="grid md:grid-cols-4 gap-4 text-xs text-gray-700">
              <div>
                <span class="block font-medium">Study Period</span>
                <span
                  >{timingAnalysis.dateRange.start} to {timingAnalysis.dateRange
                    .end}</span
                >
              </div>
              <div>
                <span class="block font-medium">Data Points</span>
                <span
                  >{timingAnalysis.dataPoints.toLocaleString()} trading days</span
                >
              </div>
              <div>
                <span class="block font-medium">Monthly Variance</span>
                <span>σ = {timingAnalysis.monthlyStdDev}%</span>
              </div>
              <div>
                <span class="block font-medium">Weekly Variance</span>
                <span>σ = {timingAnalysis.weeklyStdDev}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day of Month Analysis -->
      <div class="bg-white border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Day of Month Performance Analysis
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            Investment performance by calendar day (ranked by total return)
          </p>
        </div>

        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-2 font-medium text-gray-900">Rank</th>
                  <th class="text-left py-2 font-medium text-gray-900"
                    >Day of Month</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Investments</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Total Invested</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Avg. Cost/Share</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Final Value</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Total Return</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {#each timingAnalysis.dayOfMonthResults as result, index}
                  <tr
                    class={index < 3
                      ? "bg-green-50"
                      : index >= timingAnalysis.dayOfMonthResults.length - 3
                        ? "bg-red-50"
                        : ""}
                  >
                    <td class="py-2 font-medium text-gray-900">#{index + 1}</td>
                    <td class="py-2 font-medium"
                      >{result.day}{result.day === 1
                        ? "st"
                        : result.day === 2
                          ? "nd"
                          : result.day === 3
                            ? "rd"
                            : "th"}</td
                    >
                    <td class="py-2 text-right font-mono"
                      >{result.investmentCount}</td
                    >
                    <td class="py-2 text-right font-mono"
                      >${result.totalInvested.toLocaleString()}</td
                    >
                    <td class="py-2 text-right font-mono">${result.avgCost}</td>
                    <td class="py-2 text-right font-mono"
                      >${parseFloat(result.finalValue).toLocaleString()}</td
                    >
                    <td
                      class="py-2 text-right font-mono {parseFloat(
                        result.totalReturn
                      ) >= 0
                        ? 'text-green-700'
                        : 'text-red-700'}"
                    >
                      {parseFloat(result.totalReturn) >= 0
                        ? "+"
                        : ""}{result.totalReturn}%
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Day of Week Analysis -->
      <div class="bg-white border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Day of Week Performance Analysis
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            Investment performance by weekday (ranked by total return)
          </p>
        </div>

        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-2 font-medium text-gray-900">Rank</th>
                  <th class="text-left py-2 font-medium text-gray-900"
                    >Day of Week</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Investments</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Total Invested</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Avg. Cost/Share</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Final Value</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Total Return</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {#each timingAnalysis.dayOfWeekResults as result, index}
                  <tr
                    class={index < 2
                      ? "bg-green-50"
                      : index >= timingAnalysis.dayOfWeekResults.length - 2
                        ? "bg-red-50"
                        : ""}
                  >
                    <td class="py-2 font-medium text-gray-900">#{index + 1}</td>
                    <td class="py-2 font-medium">{result.dayName}</td>
                    <td class="py-2 text-right font-mono"
                      >{result.investmentCount}</td
                    >
                    <td class="py-2 text-right font-mono"
                      >${result.totalInvested.toLocaleString()}</td
                    >
                    <td class="py-2 text-right font-mono">${result.avgCost}</td>
                    <td class="py-2 text-right font-mono"
                      >${parseFloat(result.finalValue).toLocaleString()}</td
                    >
                    <td
                      class="py-2 text-right font-mono {parseFloat(
                        result.totalReturn
                      ) >= 0
                        ? 'text-green-700'
                        : 'text-red-700'}"
                    >
                      {parseFloat(result.totalReturn) >= 0
                        ? "+"
                        : ""}{result.totalReturn}%
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Analysis Interpretation -->
      <div class="bg-white border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Analysis Interpretation
          </h3>
        </div>

        <div class="p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Based on {timingAnalysis.dataPoints.toLocaleString()} trading days from
            <strong>{timingAnalysis.dateRange.start}</strong>
            to
            <strong>{timingAnalysis.dateRange.end}</strong>, this analysis
            reveals the historical impact of investment timing on Dollar Cost
            Averaging performance.
          </p>

          <p>
            <strong>Day of Month Findings:</strong> The {timingAnalysis
              .bestDayOfMonth.day}{timingAnalysis.bestDayOfMonth.day === 1
              ? "st"
              : timingAnalysis.bestDayOfMonth.day === 2
                ? "nd"
                : timingAnalysis.bestDayOfMonth.day === 3
                  ? "rd"
                  : "th"}
            of the month historically produced the highest returns ({timingAnalysis
              .bestDayOfMonth.totalReturn}%), while the
            {timingAnalysis.worstDayOfMonth.day}{timingAnalysis.worstDayOfMonth
              .day === 1
              ? "st"
              : timingAnalysis.worstDayOfMonth.day === 2
                ? "nd"
                : timingAnalysis.worstDayOfMonth.day === 3
                  ? "rd"
                  : "th"}
            produced the lowest ({timingAnalysis.worstDayOfMonth.totalReturn}%).
            The standard deviation of
            {timingAnalysis.monthlyStdDev}% indicates {parseFloat(
              timingAnalysis.monthlyStdDev
            ) > 2
              ? "significant"
              : "modest"} variation in outcomes based on monthly timing.
          </p>

          <p>
            <strong>Day of Week Findings:</strong>
            {timingAnalysis.bestDayOfWeek.dayName} investments historically outperformed
            ({timingAnalysis.bestDayOfWeek.totalReturn}%), while {timingAnalysis
              .worstDayOfWeek.dayName} showed the weakest performance ({timingAnalysis
              .worstDayOfWeek.totalReturn}%). The weekly standard deviation of {timingAnalysis.weeklyStdDev}%
            suggests
            {parseFloat(timingAnalysis.weeklyStdDev) > 2
              ? "meaningful"
              : "limited"} differences between weekday investment timing.
          </p>

          <div class="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400">
            <p class="text-orange-800 text-xs font-medium mb-1">
              STATISTICAL DISCLAIMER
            </p>
            <p class="text-orange-700 text-xs">
              While these patterns exist in historical data, the differences may
              not be statistically significant enough to reliably predict future
              performance. Market timing effects are generally considered less
              important than consistent investment discipline and long-term
              commitment to a DCA strategy.
            </p>
          </div>

          <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-200">
            <p class="text-blue-800 text-xs font-medium mb-1">
              METHODOLOGY NOTE
            </p>
            <p class="text-blue-700 text-xs">
              Analysis assumes $100 investments on specified days, with dividend
              reinvestment and no transaction costs. Days falling on weekends or
              holidays are adjusted to the next trading day. Results exclude
              taxes and fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <p class="text-xs text-gray-600 my-8">
    Data source:
    <a
      href="https://www.macrotrends.net/2324/sp-500-historical-chart-data"
      class="text-zinc-600 hover:text-zinc-800 underline"
      target="_blank"
      rel="noopener noreferrer">MacroTrends S&P 500 Historical Data</a
    >
  </p>
</main>
