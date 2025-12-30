<script lang="ts">
  import { page } from "$app/state";
  import {
    Share,
    TrendingDown,
    TrendingUp,
    AlertTriangle,
  } from "lucide-svelte";
  import { addToast } from "$lib/state.svelte";

  let { data } = $props();

  let selectedRecession = $state(data.recessionPeriods[0]?.name || "");
  let investmentAmount = $state(page.url.searchParams.get("amount") || "500");
  let investmentFrequency = $state(
    page.url.searchParams.get("frequency") || "monthly"
  );

  // DCA Analysis for selected recession
  let recessionAnalysis = $derived.by(() => {
    if (!selectedRecession || !data.recessionPeriods.length) return null;

    const recession = data.recessionPeriods.find(
      (r) => r.name === selectedRecession
    );
    if (!recession) return null;

    const startDate = new Date(recession.start);
    const endDate = new Date(recession.end);

    // Filter data to recession period
    const recessionData = data.parsedData.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    if (!recessionData.length) return null;

    // Calculate DCA performance during recession
    let runningShares = 0;
    let totalInvested = 0;
    let investmentCount = 0;

    const dcaData = recessionData
      .filter((item: any, index: number) => {
        const itemDate = new Date(item.date);
        const daysDiff = Math.floor(
          (itemDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (investmentFrequency) {
          case "weekly":
            return daysDiff % 7 === 0;
          case "monthly":
            return itemDate.getDate() === 1 || index === 0;
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
    const finalPrice = recessionData[recessionData.length - 1].value;
    const finalValue = runningShares * finalPrice;
    const avgCostBasis = totalInvested / runningShares;

    // Calculate performance after recession (recovery analysis)
    const recoveryData = data.parsedData.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate > endDate;
    });

    let recoveryPerformance = null;
    if (recoveryData.length > 0) {
      // Check performance 1 year after recession
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

      // Also check 2 year recovery
      const twoYearsLater = new Date(endDate);
      twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

      const twoYearData = recoveryData.find((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= twoYearsLater;
      });

      if (twoYearData && recoveryPerformance) {
        const valueAfterTwoYears = runningShares * twoYearData.value;
        const returnAfterTwoYears =
          ((valueAfterTwoYears - totalInvested) / totalInvested) * 100;

        recoveryPerformance.twoYearPrice = twoYearData.value.toFixed(2);
        recoveryPerformance.twoYearValue = valueAfterTwoYears.toFixed(2);
        recoveryPerformance.twoYearReturn = returnAfterTwoYears.toFixed(2);
        recoveryPerformance.twoYearDate = twoYearData.date;
      }
    }

    // Get recession statistics
    const recessionStats = data.recessionStats.find(
      (r) => r.name === selectedRecession
    );

    return {
      recession,
      recessionStats,
      dcaData,
      summary: {
        totalInvested,
        totalShares: runningShares.toFixed(4),
        avgCostBasis: avgCostBasis.toFixed(2),
        finalValue: finalValue.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        recessionReturn: (
          ((finalValue - totalInvested) / totalInvested) *
          100
        ).toFixed(2),
        investmentCount,
        lowestPrice: Math.min(
          ...recessionData.map((d: any) => d.value)
        ).toFixed(2),
        highestPrice: Math.max(
          ...recessionData.map((d: any) => d.value)
        ).toFixed(2),
      },
      recoveryPerformance,
    };
  });

  // Overall recession statistics
  let recessionStats = $derived.by(() => {
    if (!data.recessionStats.length) return null;

    const avgDuration =
      data.recessionPeriods.reduce((sum, r) => sum + r.duration, 0) /
      data.recessionPeriods.length;
    const totalMonths = data.recessionPeriods.reduce(
      (sum, r) => sum + r.duration,
      0
    );

    return {
      totalRecessions: data.recessionPeriods.length,
      avgDuration: avgDuration.toFixed(1),
      totalMonths,
      severityBreakdown: {
        severe: data.recessionPeriods.filter((r) => r.severity === "Severe")
          .length,
        moderate: data.recessionPeriods.filter((r) => r.severity === "Moderate")
          .length,
        mild: data.recessionPeriods.filter((r) => r.severity === "Mild").length,
        sharp: data.recessionPeriods.filter(
          (r) => r.severity === "Sharp but Brief"
        ).length,
      },
    };
  });

  async function copyShareUrl() {
    try {
      const url = `${page.url.origin}${page.url.pathname}?amount=${investmentAmount}&frequency=${investmentFrequency}&period=${encodeURIComponent(selectedRecession)}`;
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
    >DCA During Recessions Analysis - S&P 500 Performance During Economic
    Downturns</title
  >
  <meta
    name="description"
    content="Academic analysis of Dollar Cost Averaging during official US recession periods. Study systematic investment performance during economic contractions and recoveries."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="flex items-center justify-between pb-4">
    <div>
      <h1 class="text-2xl font-medium text-gray-900 mb-2">
        DCA Performance During Economic Recessions
      </h1>
      <p class="text-sm text-gray-600">
        Dollar Cost Averaging During Official US Recession Periods
      </p>
      {#if data.metadata?.lastUpdated}
        <p class="text-xs text-gray-500 mt-1">
          Last updated {data.metadata.lastUpdated} • Source {data.metadata.source}
        </p>
      {/if}
    </div>
    <button
      onclick={copyShareUrl}
      class="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
    >
      <span>Share Analysis</span>
      <Share class="w-4 h-4" />
    </button>
  </div>

  <div class="mb-8 p-4 bg-orange-50 border-l-4 border-orange-400">
    <div class="flex items-start gap-3">
      <AlertTriangle class="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
      <div class="text-sm text-orange-800 leading-relaxed">
        <p class="font-medium mb-1">Economic Recession Analysis</p>
        <p>
          This study examines Dollar Cost Averaging performance during
          officially declared US recessions as defined by the National Bureau of
          Economic Research (NBER). Recessions represent periods of significant
          economic decline affecting employment, production, and consumer
          spending.
        </p>
      </div>
    </div>
  </div>

  {#if recessionStats}
    <!-- Historical Recession Overview -->
    <div class="bg-white border border-gray-200 mb-8">
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          Historical US Recession Overview
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          NBER-defined recessions covered by dataset ({data.parsedData[0]?.date}
          - {data.parsedData[data.parsedData.length - 1]?.date})
        </p>
      </div>

      <div class="p-6">
        <div class="grid md:grid-cols-4 gap-6 mb-6">
          <div class="text-center">
            <div class="text-2xl font-medium text-gray-900 mb-1">
              {recessionStats.totalRecessions}
            </div>
            <div class="text-sm text-gray-600">Recessions</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-medium text-orange-600 mb-1">
              {recessionStats.avgDuration}
            </div>
            <div class="text-sm text-gray-600">Avg. Months</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-medium text-gray-900 mb-1">
              {recessionStats.totalMonths}
            </div>
            <div class="text-sm text-gray-600">Total Months</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-medium text-red-600 mb-1">
              {recessionStats.severityBreakdown.severe}
            </div>
            <div class="text-sm text-gray-600">Severe</div>
          </div>
        </div>

        <!-- Recession List -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 font-medium text-gray-900">Period</th>
                <th class="text-left py-2 font-medium text-gray-900">Name</th>
                <th class="text-right py-2 font-medium text-gray-900"
                  >Duration</th
                >
                <th class="text-left py-2 font-medium text-gray-900"
                  >Severity</th
                >
                <th class="text-left py-2 font-medium text-gray-900"
                  >Description</th
                >
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {#each data.recessionPeriods as recession}
                <tr class="hover:bg-gray-50">
                  <td class="py-2 font-mono text-xs"
                    >{recession.start} to {recession.end}</td
                  >
                  <td class="py-2 font-medium">{recession.name}</td>
                  <td class="py-2 text-right font-mono"
                    >{recession.duration} months</td
                  >
                  <td class="py-2">
                    <span
                      class="px-2 py-1 text-xs rounded-full {recession.severity ===
                      'Severe'
                        ? 'bg-red-100 text-red-800'
                        : recession.severity === 'Moderate'
                          ? 'bg-orange-100 text-orange-800'
                          : recession.severity === 'Mild'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-purple-100 text-purple-800'}"
                    >
                      {recession.severity}
                    </span>
                  </td>
                  <td class="py-2 text-gray-600 text-xs max-w-xs"
                    >{recession.description}</td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- S&P 500 Performance During Recessions -->
    {#if data.recessionStats.length > 0}
      <div class="bg-white border border-gray-200 mb-8">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            S&P 500 Performance During Recessions
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            Market behavior during economic contractions
          </p>
        </div>

        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-2 font-medium text-gray-900"
                    >Recession</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Start Price</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >End Price</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Price Change</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Min Price</th
                  >
                  <th class="text-right py-2 font-medium text-gray-900"
                    >Max Drawdown</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {#each data.recessionStats as stat}
                  <tr class="hover:bg-gray-50">
                    <td class="py-2 font-medium">{stat.name}</td>
                    <td class="py-2 text-right font-mono">${stat.startPrice}</td
                    >
                    <td class="py-2 text-right font-mono">${stat.endPrice}</td>
                    <td
                      class="py-2 text-right font-mono {parseFloat(
                        stat.priceChange
                      ) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'}"
                    >
                      {parseFloat(stat.priceChange) >= 0
                        ? "+"
                        : ""}{stat.priceChange}%
                    </td>
                    <td class="py-2 text-right font-mono">${stat.minPrice}</td>
                    <td class="py-2 text-right font-mono text-red-600"
                      >-{stat.maxDrawdown}%</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}

    <!-- Analysis Parameters -->
    <div class="bg-gray-50 border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-medium mb-6 text-gray-900">
        DCA Analysis Parameters
      </h2>

      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Recession Period
          </label>
          <select
            bind:value={selectedRecession}
            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none appearance-none text-sm"
          >
            {#each data.recessionPeriods as recession}
              <option value={recession.name}>{recession.name}</option>
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
    {#if recessionAnalysis}
      <div class="space-y-8">
        <!-- Performance Summary -->
        <div class="bg-white border border-gray-200">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              DCA Performance Summary
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {recessionAnalysis.recession.name} ({recessionAnalysis.recession
                .start} to {recessionAnalysis.recession.end})
            </p>
          </div>

          <div class="p-6">
            <!-- Recession Context -->
            <div class="bg-orange-50 border border-orange-200 p-4 mb-6">
              <div class="flex items-start gap-3">
                <AlertTriangle
                  class="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0"
                />
                <div class="text-sm">
                  <h3 class="font-medium text-orange-800 mb-1">
                    Recession Context
                  </h3>
                  <p class="text-orange-700 mb-2">
                    {recessionAnalysis.recession.description}
                  </p>
                  <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span class="font-medium">Duration:</span>
                      {recessionAnalysis.recession.duration} months
                    </div>
                    <div>
                      <span class="font-medium">Severity:</span>
                      {recessionAnalysis.recession.severity}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <!-- During Recession -->
              <div class="bg-red-50 border border-red-200 p-4">
                <div class="flex items-center gap-2 mb-3">
                  <TrendingDown class="w-4 h-4 text-red-600" />
                  <h3 class="font-medium text-red-800">During Recession</h3>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-red-700">Total Invested:</span>
                    <span class="font-medium font-mono"
                      >${recessionAnalysis.summary.totalInvested.toLocaleString()}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Shares Accumulated:</span>
                    <span class="font-medium font-mono"
                      >{recessionAnalysis.summary.totalShares}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Average Cost Basis:</span>
                    <span class="font-medium font-mono"
                      >${recessionAnalysis.summary.avgCostBasis}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Value at Recession End:</span>
                    <span class="font-medium font-mono"
                      >${parseFloat(
                        recessionAnalysis.summary.finalValue
                      ).toLocaleString()}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-red-700">Recession Return:</span>
                    <span
                      class="font-medium font-mono {parseFloat(
                        recessionAnalysis.summary.recessionReturn
                      ) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'}"
                    >
                      {parseFloat(recessionAnalysis.summary.recessionReturn) >=
                      0
                        ? "+"
                        : ""}{recessionAnalysis.summary.recessionReturn}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Recovery Performance -->
              {#if recessionAnalysis.recoveryPerformance}
                <div class="bg-green-50 border border-green-200 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <TrendingUp class="w-4 h-4 text-green-600" />
                    <h3 class="font-medium text-green-800">
                      Post-Recession Recovery
                    </h3>
                  </div>
                  <div class="space-y-2 text-sm">
                    <div class="font-medium text-green-800 text-xs mb-2">
                      ONE YEAR LATER
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">Date:</span>
                      <span class="font-medium font-mono"
                        >{recessionAnalysis.recoveryPerformance.date}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">Portfolio Value:</span>
                      <span class="font-medium font-mono"
                        >${parseFloat(
                          recessionAnalysis.recoveryPerformance.oneYearValue
                        ).toLocaleString()}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-green-700">Total Return:</span>
                      <span
                        class="font-medium font-mono {parseFloat(
                          recessionAnalysis.recoveryPerformance.oneYearReturn
                        ) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'}"
                      >
                        {parseFloat(
                          recessionAnalysis.recoveryPerformance.oneYearReturn
                        ) >= 0
                          ? "+"
                          : ""}{recessionAnalysis.recoveryPerformance
                          .oneYearReturn}%
                      </span>
                    </div>

                    {#if recessionAnalysis.recoveryPerformance.twoYearReturn}
                      <div
                        class="font-medium text-green-800 text-xs mb-2 mt-4 pt-2 border-t border-green-200"
                      >
                        TWO YEARS LATER
                      </div>
                      <div class="flex justify-between">
                        <span class="text-green-700">Portfolio Value:</span>
                        <span class="font-medium font-mono"
                          >${parseFloat(
                            recessionAnalysis.recoveryPerformance.twoYearValue
                          ).toLocaleString()}</span
                        >
                      </div>
                      <div class="flex justify-between">
                        <span class="text-green-700">Total Return:</span>
                        <span
                          class="font-medium font-mono {parseFloat(
                            recessionAnalysis.recoveryPerformance.twoYearReturn
                          ) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'}"
                        >
                          {parseFloat(
                            recessionAnalysis.recoveryPerformance.twoYearReturn
                          ) >= 0
                            ? "+"
                            : ""}{recessionAnalysis.recoveryPerformance
                            .twoYearReturn}%
                        </span>
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>

            <!-- Key Metrics -->
            <div class="bg-gray-50 border border-gray-200 p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">
                Investment Metrics
              </h3>
              <div class="grid md:grid-cols-4 gap-4 text-xs text-gray-700">
                <div>
                  <span class="block font-medium">Investment Count</span>
                  <span class="font-mono"
                    >{recessionAnalysis.summary.investmentCount} purchases</span
                  >
                </div>
                <div>
                  <span class="block font-medium">Price Range</span>
                  <span class="font-mono"
                    >${recessionAnalysis.summary.lowestPrice} - ${recessionAnalysis
                      .summary.highestPrice}</span
                  >
                </div>
                <div>
                  <span class="block font-medium">Recession Duration</span>
                  <span class="font-mono"
                    >{recessionAnalysis.recession.duration} months</span
                  >
                </div>
                {#if recessionAnalysis.recessionStats}
                  <div>
                    <span class="block font-medium">Market Drawdown</span>
                    <span class="font-mono text-red-600"
                      >-{recessionAnalysis.recessionStats.maxDrawdown}%</span
                    >
                  </div>
                {/if}
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
              Chronological record of DCA purchases during recession
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
                  {#each recessionAnalysis.dcaData as transaction, index}
                    <tr
                      class="hover:bg-gray-50 {index ===
                      recessionAnalysis.dcaData.length - 1
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
              During the <strong>{recessionAnalysis.recession.name}</strong>
              recession ({recessionAnalysis.recession.start} to {recessionAnalysis
                .recession.end}), Dollar Cost Averaging with ${investmentAmount}
              {investmentFrequency} investments resulted in
              {recessionAnalysis.summary.investmentCount} total purchases over {recessionAnalysis
                .recession.duration} months.
            </p>

            <p>
              This recession was classified as <strong
                >{recessionAnalysis.recession.severity}</strong
              >
              and was caused by
              {recessionAnalysis.recession.description.toLowerCase()}. The
              strategy achieved an average cost basis of
              <strong>${recessionAnalysis.summary.avgCostBasis}</strong> per share
              during the economic downturn.
            </p>

            <p>
              <strong>Recession Performance:</strong> By the end of the
              recession, the DCA portfolio showed a
              <strong>{recessionAnalysis.summary.recessionReturn}%</strong>
              return, demonstrating
              {parseFloat(recessionAnalysis.summary.recessionReturn) >= 0
                ? "resilience during the economic contraction"
                : "the challenging nature of this economic period"}.
            </p>

            {#if recessionAnalysis.recoveryPerformance}
              <p>
                <strong>Recovery Analysis:</strong> One year after the recession
                ended, the DCA portfolio achieved a
                <strong
                  >{recessionAnalysis.recoveryPerformance
                    .oneYearReturn}%</strong
                >
                total return.
                {#if recessionAnalysis.recoveryPerformance.twoYearReturn}
                  Two years post-recession, returns reached <strong
                    >{recessionAnalysis.recoveryPerformance
                      .twoYearReturn}%</strong
                  >,
                  {parseFloat(
                    recessionAnalysis.recoveryPerformance.twoYearReturn
                  ) >
                  parseFloat(
                    recessionAnalysis.recoveryPerformance.oneYearReturn
                  )
                    ? "showing continued recovery momentum"
                    : "reflecting the volatility of post-recession markets"}.
                {/if}
              </p>
            {/if}

            <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-200">
              <p class="text-blue-800 text-xs font-medium mb-1">
                ECONOMIC INSIGHT
              </p>
              <p class="text-blue-700 text-xs">
                Economic recessions often create attractive entry points for
                systematic investors. While markets may decline during the
                recession itself, the disciplined approach of Dollar Cost
                Averaging typically positions investors well for the eventual
                economic recovery and market expansion that follows.
              </p>
            </div>

            <div class="mt-4 p-4 bg-orange-50 border-l-4 border-orange-400">
              <p class="text-orange-800 text-xs font-medium mb-1">
                METHODOLOGY NOTE
              </p>
              <p class="text-orange-700 text-xs">
                Recession periods are based on official NBER dating. Analysis
                assumes dividend reinvestment and excludes transaction costs,
                taxes, and fees. Recovery analysis uses actual market
                performance where available. Past recession performance does not
                guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/if}

  <p class="text-xs text-gray-600 my-8">
    Data sources:
    <a
      href="https://www.macrotrends.net/2324/sp-500-historical-chart-data"
      class="text-zinc-600 hover:text-zinc-800 underline"
      target="_blank"
      rel="noopener noreferrer">MacroTrends S&P 500 Historical Data</a
    >,
    <a
      href="https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions"
      class="text-zinc-600 hover:text-zinc-800 underline"
      target="_blank"
      rel="noopener noreferrer">NBER Recession Dating</a
    >
  </p>
</main>
