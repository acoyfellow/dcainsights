<script lang="ts">
  import { page } from "$app/state";
  import { Share, TrendingDown, TrendingUp } from "lucide-svelte";
  import { addToast } from "$lib/state.svelte";

  let { data } = $props();

  let selectedBearMarket = $state(data.bearMarketPeriods[0]?.name || "");
  let investmentAmount = $state(page.url.searchParams.get("amount") || "500");
  let investmentFrequency = $state(
    page.url.searchParams.get("frequency") || "monthly"
  );

  // DCA Analysis for selected bear market
  let bearMarketAnalysis = $derived.by(() => {
    if (!selectedBearMarket || !data.bearMarketPeriods.length) return null;

    const bearMarket = data.bearMarketPeriods.find(
      (bm) => bm.name === selectedBearMarket
    );
    if (!bearMarket) return null;

    const startDate = new Date(bearMarket.start);
    const endDate = new Date(bearMarket.end);

    // Filter data to bear market period
    const bearMarketData = data.parsedData.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    if (!bearMarketData.length) return null;

    // Calculate DCA performance during bear market
    let runningShares = 0;
    let totalInvested = 0;
    let investmentCount = 0;

    const dcaData = bearMarketData
      .filter((item: any, index: number) => {
        const itemDate = new Date(item.date);
        const daysDiff = Math.floor(
          (itemDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (investmentFrequency) {
          case "weekly":
            return daysDiff % 7 === 0;
          case "monthly":
            return itemDate.getDate() === 1 || index === 0; // 1st of month or first available
          case "quarterly":
            return (
              (itemDate.getMonth() % 3 === 0 && itemDate.getDate() === 1) ||
              index === 0
            );
          default:
            return true; // daily
        }
      })
      .map((item: any, index: number) => {
        const shares = Number(investmentAmount) / item.value;
        runningShares += shares;
        totalInvested += Number(investmentAmount);
        investmentCount++;

        const currentValue = runningShares * item.value;
        const unrealizedReturn =
          ((currentValue - totalInvested) / totalInvested) * 100;

        return {
          date: item.date,
          price: item.value.toFixed(2),
          shares: shares.toFixed(4),
          totalShares: runningShares.toFixed(4),
          invested: totalInvested,
          currentValue: currentValue.toFixed(2),
          unrealizedReturn: unrealizedReturn.toFixed(2),
          avgCost: (totalInvested / runningShares).toFixed(2),
        };
      });

    // Calculate final performance
    const finalPrice = bearMarketData[bearMarketData.length - 1].value;
    const finalValue = runningShares * finalPrice;
    const avgCostBasis = totalInvested / runningShares;

    // Calculate performance after bear market (recovery analysis)
    const recoveryData = data.parsedData.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate > endDate;
    });

    let recoveryPerformance = null;
    if (recoveryData.length > 0) {
      // Check performance 1 year after bear market
      const oneYearLater = new Date(endDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const oneYearData = recoveryData.find((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= oneYearLater;
      });

      if (oneYearData) {
        const valueAfterOneYear = runningShares * oneYearData.value;
        const returnAfterOneYear =
          ((valueAfterOneYear - totalInvested) / totalInvested) * 100;

        recoveryPerformance = {
          oneYearPrice: oneYearData.value.toFixed(2),
          oneYearValue: valueAfterOneYear.toFixed(2),
          oneYearReturn: returnAfterOneYear.toFixed(2),
          date: oneYearData.date,
        };
      }
    }

    return {
      bearMarket,
      dcaData,
      summary: {
        totalInvested,
        totalShares: runningShares.toFixed(4),
        avgCostBasis: avgCostBasis.toFixed(2),
        finalValue: finalValue.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        bearMarketReturn: (
          ((finalValue - totalInvested) / totalInvested) *
          100
        ).toFixed(2),
        investmentCount,
        lowestPrice: Math.min(
          ...bearMarketData.map((d: any) => d.value)
        ).toFixed(2),
        highestPrice: Math.max(
          ...bearMarketData.map((d: any) => d.value)
        ).toFixed(2),
      },
      recoveryPerformance,
    };
  });

  // Overall bear market statistics
  let bearMarketStats = $derived.by(() => {
    if (!data.bearMarketPeriods.length) return null;

    const avgDecline =
      data.bearMarketPeriods.reduce((sum, bm) => sum + bm.decline, 0) /
      data.bearMarketPeriods.length;
    const avgDuration =
      data.bearMarketPeriods.reduce((sum, bm) => sum + bm.duration, 0) /
      data.bearMarketPeriods.length;
    const maxDecline = Math.max(
      ...data.bearMarketPeriods.map((bm) => bm.decline)
    );
    const maxDuration = Math.max(
      ...data.bearMarketPeriods.map((bm) => bm.duration)
    );

    return {
      totalBearMarkets: data.bearMarketPeriods.length,
      avgDecline: avgDecline.toFixed(1),
      avgDuration: Math.round(avgDuration),
      maxDecline: maxDecline.toFixed(1),
      maxDuration,
    };
  });

  async function copyShareUrl() {
    try {
      const url = `${page.url.origin}${page.url.pathname}?amount=${investmentAmount}&frequency=${investmentFrequency}&period=${encodeURIComponent(selectedBearMarket)}`;
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
  <title
    >Bear Market DCA Analysis - S&P 500 Performance During Market Downturns</title
  >
  <meta
    name="description"
    content="Comprehensive analysis of Dollar Cost Averaging performance during S&P 500 bear markets. Study how DCA strategies performed during major market downturns and crashes."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="flex items-center justify-between pb-4">
    <div>
      <h1 class="text-2xl font-medium text-gray-900 mb-2">
        Bear Market DCA Performance Analysis
      </h1>
      <p class="text-sm text-gray-600">
        Dollar Cost Averaging During S&P 500 Market Downturns
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

  <div class="mb-8 p-4 bg-red-50 border-l-4 border-red-400">
    <p class="text-sm text-red-800 leading-relaxed">
      This analysis examines Dollar Cost Averaging performance during officially
      defined bear markets (20% or greater decline from recent peak). Bear
      markets test the resilience of systematic investment strategies and often
      present the greatest opportunities for long-term wealth accumulation.
    </p>
  </div>

  {#if bearMarketStats}
    <!-- Historical Bear Market Overview -->
    <div class="bg-white border border-gray-200 mb-8">
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          Historical Bear Market Overview
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          S&P 500 bear markets in dataset ({data.parsedData[0]?.date} - {data
            .parsedData[data.parsedData.length - 1]?.date})
        </p>
      </div>

      <div class="p-6">
        <div class="grid md:grid-cols-4 gap-6 mb-6">
          <div class="text-center">
            <div class="text-2xl font-medium text-gray-900 mb-1">
              {bearMarketStats.totalBearMarkets}
            </div>
            <div class="text-sm text-gray-600">Bear Markets</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-medium text-red-600 mb-1">
              -{bearMarketStats.avgDecline}%
            </div>
            <div class="text-sm text-gray-600">Avg. Decline</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-medium text-gray-900 mb-1">
              {bearMarketStats.avgDuration}
            </div>
            <div class="text-sm text-gray-600">Avg. Days</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-medium text-red-700 mb-1">
              -{bearMarketStats.maxDecline}%
            </div>
            <div class="text-sm text-gray-600">Max Decline</div>
          </div>
        </div>

        <!-- Bear Market List -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 font-medium text-gray-900">Period</th>
                <th class="text-left py-2 font-medium text-gray-900">Name</th>
                <th class="text-right py-2 font-medium text-gray-900"
                  >Duration (Days)</th
                >
                <th class="text-right py-2 font-medium text-gray-900"
                  >Peak Value</th
                >
                <th class="text-right py-2 font-medium text-gray-900"
                  >Trough Value</th
                >
                <th class="text-right py-2 font-medium text-gray-900"
                  >Max Decline</th
                >
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {#each data.bearMarketPeriods as bearMarket}
                <tr class="hover:bg-gray-50">
                  <td class="py-2 font-mono text-xs"
                    >{bearMarket.start} to {bearMarket.end}</td
                  >
                  <td class="py-2 font-medium">{bearMarket.name}</td>
                  <td class="py-2 text-right font-mono"
                    >{bearMarket.duration}</td
                  >
                  <td class="py-2 text-right font-mono"
                    >${bearMarket.peakValue.toFixed(2)}</td
                  >
                  <td class="py-2 text-right font-mono"
                    >${bearMarket.troughValue.toFixed(2)}</td
                  >
                  <td class="py-2 text-right font-mono text-red-600"
                    >-{bearMarket.decline.toFixed(1)}%</td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Analysis Parameters -->
    <div class="bg-gray-50 border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-medium mb-6 text-gray-900">
        DCA Analysis Parameters
      </h2>

      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bear Market Period
          </label>
          <select
            bind:value={selectedBearMarket}
            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none appearance-none text-sm"
          >
            {#each data.bearMarketPeriods as bearMarket}
              <option value={bearMarket.name}>{bearMarket.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount per Period
          </label>
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >$</span
            >
            <input
              type="number"
              bind:value={investmentAmount}
              class="w-full pl-8 pr-4 py-2 border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none text-sm"
              min="1"
              max="10000"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Investment Frequency
          </label>
          <select
            bind:value={investmentFrequency}
            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none appearance-none text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      </div>
    </div>

    <!-- DCA Performance Analysis -->
    {#if bearMarketAnalysis}
      <div class="space-y-8">
        <!-- Performance Summary -->
        <div class="bg-white border border-gray-200">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              DCA Performance Summary
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {bearMarketAnalysis.bearMarket.name} ({bearMarketAnalysis
                .bearMarket.start} to {bearMarketAnalysis.bearMarket.end})
            </p>
          </div>

          <div class="p-6">
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <!-- During Bear Market -->
              <div class="bg-red-50 border border-red-200 p-4">
                <div class="flex items-center gap-2 mb-3">
                  <TrendingDown class="w-4 h-4 text-red-600" />
                  <h3 class="font-medium text-red-800">During Bear Market</h3>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-red-700">Total Invested:</span>
                    <span class="font-medium font-mono"
                      >${bearMarketAnalysis.summary.totalInvested.toLocaleString()}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Shares Accumulated:</span>
                    <span class="font-medium font-mono"
                      >{bearMarketAnalysis.summary.totalShares}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Average Cost Basis:</span>
                    <span class="font-medium font-mono"
                      >${bearMarketAnalysis.summary.avgCostBasis}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Value at Bear End:</span>
                    <span class="font-medium font-mono"
                      >${parseFloat(
                        bearMarketAnalysis.summary.finalValue
                      ).toLocaleString()}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Bear Market Return:</span>
                    <span
                      class="font-medium font-mono {parseFloat(
                        bearMarketAnalysis.summary.bearMarketReturn
                      ) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'}"
                    >
                      {parseFloat(
                        bearMarketAnalysis.summary.bearMarketReturn
                      ) >= 0
                        ? "+"
                        : ""}{bearMarketAnalysis.summary.bearMarketReturn}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Recovery Performance -->
              {#if bearMarketAnalysis.recoveryPerformance}
                <div class="bg-green-50 border border-green-200 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <TrendingUp class="w-4 h-4 text-green-600" />
                    <h3 class="font-medium text-green-800">
                      One Year Post-Bear Market
                    </h3>
                  </div>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-green-700">Date:</span>
                      <span class="font-medium font-mono"
                        >{bearMarketAnalysis.recoveryPerformance.date}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">S&P 500 Price:</span>
                      <span class="font-medium font-mono"
                        >${bearMarketAnalysis.recoveryPerformance
                          .oneYearPrice}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">Portfolio Value:</span>
                      <span class="font-medium font-mono"
                        >${parseFloat(
                          bearMarketAnalysis.recoveryPerformance.oneYearValue
                        ).toLocaleString()}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">Total Return:</span>
                      <span
                        class="font-medium font-mono {parseFloat(
                          bearMarketAnalysis.recoveryPerformance.oneYearReturn
                        ) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'}"
                      >
                        {parseFloat(
                          bearMarketAnalysis.recoveryPerformance.oneYearReturn
                        ) >= 0
                          ? "+"
                          : ""}{bearMarketAnalysis.recoveryPerformance
                          .oneYearReturn}%
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">Profit/Loss:</span>
                      <span
                        class="font-medium font-mono {parseFloat(
                          bearMarketAnalysis.recoveryPerformance.oneYearValue
                        ) >= bearMarketAnalysis.summary.totalInvested
                          ? 'text-green-600'
                          : 'text-red-600'}"
                      >
                        ${(
                          parseFloat(
                            bearMarketAnalysis.recoveryPerformance.oneYearValue
                          ) - bearMarketAnalysis.summary.totalInvested
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Key Metrics -->
            <div class="bg-gray-50 border border-gray-200 p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">
                Key Metrics
              </h3>
              <div class="grid md:grid-cols-4 gap-4 text-xs text-gray-700">
                <div>
                  <span class="block font-medium">Investment Count</span>
                  <span class="font-mono"
                    >{bearMarketAnalysis.summary.investmentCount} purchases</span
                  >
                </div>
                <div>
                  <span class="block font-medium">Price Range</span>
                  <span class="font-mono"
                    >${bearMarketAnalysis.summary.lowestPrice} - ${bearMarketAnalysis
                      .summary.highestPrice}</span
                  >
                </div>
                <div>
                  <span class="block font-medium">Bear Duration</span>
                  <span class="font-mono"
                    >{bearMarketAnalysis.bearMarket.duration} days</span
                  >
                </div>
                <div>
                  <span class="block font-medium">Market Decline</span>
                  <span class="font-mono text-red-600"
                    >-{bearMarketAnalysis.bearMarket.decline.toFixed(1)}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Transaction History -->
        <div class="bg-white border border-gray-200">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Investment Transaction History
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Chronological record of DCA purchases during bear market
            </p>
          </div>

          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-2 font-medium text-gray-900"
                      >Date</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >S&P 500 Price</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >Investment</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >Shares Bought</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >Total Shares</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >Avg. Cost</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >Current Value</th
                    >
                    <th class="text-right py-2 font-medium text-gray-900"
                      >Unrealized Return</th
                    >
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {#each bearMarketAnalysis.dcaData as transaction, index}
                    <tr
                      class="hover:bg-gray-50 {index ===
                      bearMarketAnalysis.dcaData.length - 1
                        ? 'bg-blue-50'
                        : ''}"
                    >
                      <td class="py-2 font-mono text-xs">{transaction.date}</td>
                      <td class="py-2 text-right font-mono"
                        >${transaction.price}</td
                      >
                      <td class="py-2 text-right font-mono"
                        >${investmentAmount}</td
                      >
                      <td class="py-2 text-right font-mono"
                        >{transaction.shares}</td
                      >
                      <td class="py-2 text-right font-mono"
                        >{transaction.totalShares}</td
                      >
                      <td class="py-2 text-right font-mono"
                        >${transaction.avgCost}</td
                      >
                      <td class="py-2 text-right font-mono"
                        >${parseFloat(
                          transaction.currentValue
                        ).toLocaleString()}</td
                      >
                      <td
                        class="py-2 text-right font-mono {parseFloat(
                          transaction.unrealizedReturn
                        ) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'}"
                      >
                        {parseFloat(transaction.unrealizedReturn) >= 0
                          ? "+"
                          : ""}{transaction.unrealizedReturn}%
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
              During the <strong>{bearMarketAnalysis.bearMarket.name}</strong>
              bear market ({bearMarketAnalysis.bearMarket.start} to {bearMarketAnalysis
                .bearMarket.end}), Dollar Cost Averaging with ${investmentAmount}
              {investmentFrequency} investments resulted in
              {bearMarketAnalysis.summary.investmentCount} total purchases over {bearMarketAnalysis
                .bearMarket.duration} days.
            </p>

            <p>
              The strategy achieved an average cost basis of <strong
                >${bearMarketAnalysis.summary.avgCostBasis}</strong
              >
              per share, while the market declined
              <strong
                >{bearMarketAnalysis.bearMarket.decline.toFixed(1)}%</strong
              >
              from peak to trough. By the end of the bear market, the portfolio
              was
              {parseFloat(bearMarketAnalysis.summary.bearMarketReturn) >= 0
                ? "profitable"
                : "underwater"} with a
              <strong>{bearMarketAnalysis.summary.bearMarketReturn}%</strong> return.
            </p>

            {#if bearMarketAnalysis.recoveryPerformance}
              <p>
                <strong>Recovery Analysis:</strong> One year after the bear
                market ended, the DCA portfolio achieved a
                <strong
                  >{bearMarketAnalysis.recoveryPerformance
                    .oneYearReturn}%</strong
                >
                total return, demonstrating
                {parseFloat(
                  bearMarketAnalysis.recoveryPerformance.oneYearReturn
                ) > 0
                  ? "the long-term wealth-building potential of systematic investing during market downturns"
                  : "the challenging nature of this particular market environment"}.
              </p>
            {/if}

            <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-200">
              <p class="text-blue-800 text-xs font-medium mb-1">KEY INSIGHT</p>
              <p class="text-blue-700 text-xs">
                Bear markets often provide the best opportunities for Dollar
                Cost Averaging, as systematic investing during declining markets
                typically results in lower average cost bases and enhanced
                long-term returns when markets eventually recover.
              </p>
            </div>

            <div class="mt-4 p-4 bg-orange-50 border-l-4 border-orange-400">
              <p class="text-orange-800 text-xs font-medium mb-1">
                METHODOLOGY NOTE
              </p>
              <p class="text-orange-700 text-xs">
                Bear markets are defined as 20% or greater declines from recent
                market peaks. Analysis assumes dividend reinvestment and
                excludes transaction costs, taxes, and fees. Recovery analysis
                uses actual market performance one year post-bear market where
                data is available.
              </p>
            </div>
          </div>
        </div>
      </div>
    {/if}
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
