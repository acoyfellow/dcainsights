<script lang="ts">
  import { page } from "$app/state";
  import VirtualList from "svelte-tiny-virtual-list";
  import {
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    Share,
    ChevronDown,
    TrendingUp,
    TrendingDown,
  } from "lucide-svelte";
  import DCAChart from "$lib/components/DCAChart.svelte";
  import { addToast } from "$lib/state.svelte";
  import { startOfMonth, startOfWeek, startOfYear } from "date-fns";

  let { data } = $props();
  let investmentAmount = $state(page.url.searchParams.get("amount") || 100);
  let selectedInterval = $state<string>(
    page.url.searchParams.get("interval") || "monthly"
  );
  let sortColumn = $state(page.url.searchParams.get("sort") || "");
  let sortDirection = $state(page.url.searchParams.get("dir") || "asc");
  let selectedRange = $state<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  let tableData = $derived.by(() => {
    if (!data.parsedData) return [];

    // Group data by interval
    const groupedData = data.parsedData.reduce((acc: any, item: any) => {
      const date = new Date(item.date);
      let key;

      switch (selectedInterval) {
        case "monthly":
          key = startOfMonth(date).toISOString();
          break;
        case "weekly":
          key = startOfWeek(date, { weekStartsOn: 1 }).toISOString(); // Monday start
          break;
        case "annually":
          key = startOfYear(date).toISOString();
          break;
        default: // daily
          key = date.toISOString();
      }

      if (!acc[key]) {
        acc[key] = item;
      }
      return acc;
    }, {});

    const filteredData = Object.values(groupedData);

    let runningShares = 0;
    return filteredData.map((item: any, index: number) => {
      const shares = Number(investmentAmount) / Number(item.value);
      runningShares += shares;
      const invested = (index + 1) * Number(investmentAmount);

      return {
        date: item.date,
        value: Number(item.value).toFixed(2),
        invested: invested,
        shares: Number(shares).toFixed(4),
        totalShares: Number(runningShares).toFixed(4),
        avgCost: Number(invested / runningShares).toFixed(2),
      };
    });
  });

  let comparisonData = $derived.by(() => {
    if (!tableData.length) return null;

    const startDate = selectedRange.start || tableData[0].date;
    const endDate = selectedRange.end || tableData[tableData.length - 1].date;

    const startIndex = tableData.findIndex((d) => d.date === startDate);
    const endIndex = tableData.findIndex((d) => d.date === endDate);

    if (startIndex === -1 || endIndex === -1) return null;

    const rangeData = tableData.slice(startIndex, endIndex + 1);
    const totalInvested = rangeData[rangeData.length - 1].invested;
    const dcaShares = Number(rangeData[rangeData.length - 1].totalShares);
    const finalPrice = Number(rangeData[rangeData.length - 1].value);

    // Lump sum: invest total amount at start date
    const lumpSumShares = totalInvested / Number(rangeData[0].value);
    const lumpSumValue = lumpSumShares * finalPrice;
    const dcaValue = dcaShares * finalPrice;

    return {
      totalInvested,
      dcaShares,
      lumpSumShares,
      dcaValue,
      lumpSumValue,
      dcaReturn: ((dcaValue - totalInvested) / totalInvested) * 100,
      lumpSumReturn: ((lumpSumValue - totalInvested) / totalInvested) * 100,
      winner: dcaValue > lumpSumValue ? "DCA" : "Lump Sum",
      difference: Math.abs(dcaValue - lumpSumValue),
      differencePercent: Math.abs(
        ((dcaValue - lumpSumValue) / Math.min(dcaValue, lumpSumValue)) * 100
      ),
    };
  });

  let sortedTableData = $derived.by(() => {
    if (!sortColumn) return [...tableData];
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return [...tableData].sort(
      (a: any, b: any) => multiplier * (a[sortColumn] > b[sortColumn] ? 1 : -1)
    );
  });

  async function copyShareUrl() {
    try {
      const url = `${page.url.origin}${page.url.pathname}?amount=${investmentAmount}&interval=${selectedInterval}${
        sortColumn ? `&sort=${sortColumn}` : ""
      }${sortDirection ? `&dir=${sortDirection}` : ""}`;
      console.log({ url });
      if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(url);
        addToast("URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to copy URL:", error);
      addToast("Failed to copy URL to clipboard", "error");
    }
  }

  function toggleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
  }

  const columns = [
    { key: "date", label: "Date", width: "15%" },
    { key: "value", label: "Price", width: "15%" },
    { key: "invested", label: "Total Invested", width: "20%" },
    { key: "shares", label: "Shares Bought", width: "15%" },
    { key: "totalShares", label: "Total Shares", width: "15%" },
    { key: "avgCost", label: "Avg Cost/Share", width: "20%" },
  ];

  function formatDateToISO(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function handleRangeSelect(range: { start: string; end: string }) {
    selectedRange = {
      start: formatDateToISO(range.start),
      end: formatDateToISO(range.end),
    };
  }
</script>

<svelte:head>
  <title>Dollar Cost Averaging vs. Lump Sum Analysis - S&P 500 Historical Performance</title>
  <meta
    name="description"
    content="Comprehensive historical analysis comparing Dollar Cost Averaging and Lump Sum investment strategies using S&P 500 data. Academic-grade investment performance comparison tool."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="flex items-center justify-between pb-4">
    <div>
      <h1 class="text-2xl font-medium text-gray-900 mb-2">
        Dollar Cost Averaging vs. Lump Sum Investment Analysis
      </h1>
      <p class="text-sm text-gray-600">S&P 500 Historical Performance Comparison</p>
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
      This analytical tool compares the historical performance of two investment strategies:
      <strong>Dollar Cost Averaging</strong> (systematic periodic investments) versus
      <strong>Lump Sum</strong> (single initial investment). Results are based on actual
      S&P 500 historical data and demonstrate the impact of market timing versus systematic investing approaches.
    </p>
  </div>

  <div class="mb-8">
    <!-- Input Parameters Section -->
    <div class="bg-gray-50 border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-medium mb-6 text-gray-900">Analysis Parameters</h2>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount per Period
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                bind:value={investmentAmount}
                class="w-full pl-8 pr-4 py-2 border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none text-sm"
                min="1"
                max="1000000"
              />
            </div>
            <p class="text-xs text-gray-600 mt-1">
              The fixed dollar amount invested at each interval
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Investment Frequency
            </label>
            <div class="relative">
              <select
                bind:value={selectedInterval}
                class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none appearance-none text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Monday)</option>
                <option value="monthly">Monthly (1st of month)</option>
                <option value="annually">Annually (January 1st)</option>
              </select>
              <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <p class="text-xs text-gray-600 mt-1">
              How frequently investments are made
            </p>
          </div>
        </div>

        {#if comparisonData}
          <div class="bg-white border border-gray-200 p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Study Period</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Start Date:</span>
                <span class="font-mono">{selectedRange.start || tableData[0]?.date}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">End Date:</span>
                <span class="font-mono">{selectedRange.end || tableData[tableData.length - 1]?.date}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Invested:</span>
                <span class="font-mono">${comparisonData.totalInvested.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Investment Count:</span>
                <span class="font-mono">{Math.round(comparisonData.totalInvested / Number(investmentAmount))}</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Analysis Results -->
  {#if comparisonData}
    <div class="space-y-8">
      <!-- Results Overview -->
      <div class="bg-white border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Comparative Analysis Results</h2>
        </div>

        <div class="p-6">
          <!-- Performance Summary Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-2 font-medium text-gray-900">Strategy</th>
                  <th class="text-right py-2 font-medium text-gray-900">Total Invested</th>
                  <th class="text-right py-2 font-medium text-gray-900">Shares Acquired</th>
                  <th class="text-right py-2 font-medium text-gray-900">Avg. Cost/Share</th>
                  <th class="text-right py-2 font-medium text-gray-900">Final Value</th>
                  <th class="text-right py-2 font-medium text-gray-900">Total Return</th>
                  <th class="text-right py-2 font-medium text-gray-900">Annualized Return</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr>
                  <td class="py-3 font-medium text-gray-900">Dollar Cost Averaging</td>
                  <td class="py-3 text-right font-mono">${comparisonData.totalInvested.toLocaleString()}</td>
                  <td class="py-3 text-right font-mono">{comparisonData.dcaShares.toFixed(2)}</td>
                  <td class="py-3 text-right font-mono">${(comparisonData.totalInvested / comparisonData.dcaShares).toFixed(2)}</td>
                  <td class="py-3 text-right font-mono">${comparisonData.dcaValue.toLocaleString()}</td>
                  <td class="py-3 text-right font-mono {comparisonData.dcaReturn >= 0 ? 'text-green-700' : 'text-red-700'}">
                    {comparisonData.dcaReturn >= 0 ? "+" : ""}{comparisonData.dcaReturn.toFixed(2)}%
                  </td>
                  <td class="py-3 text-right font-mono text-gray-600">—</td>
                </tr>
                <tr>
                  <td class="py-3 font-medium text-gray-900">Lump Sum</td>
                  <td class="py-3 text-right font-mono">${comparisonData.totalInvested.toLocaleString()}</td>
                  <td class="py-3 text-right font-mono">{comparisonData.lumpSumShares.toFixed(2)}</td>
                  <td class="py-3 text-right font-mono">${(comparisonData.totalInvested / comparisonData.lumpSumShares).toFixed(2)}</td>
                  <td class="py-3 text-right font-mono">${comparisonData.lumpSumValue.toLocaleString()}</td>
                  <td class="py-3 text-right font-mono {comparisonData.lumpSumReturn >= 0 ? 'text-green-700' : 'text-red-700'}">
                    {comparisonData.lumpSumReturn >= 0 ? "+" : ""}{comparisonData.lumpSumReturn.toFixed(2)}%
                  </td>
                  <td class="py-3 text-right font-mono text-gray-600">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Performance Difference -->
          <div class="mt-6 p-4 bg-gray-50 border border-gray-200">
            <div class="text-center">
              <div class="text-sm text-gray-600 mb-1">Performance Difference</div>
              <div class="text-2xl font-medium text-gray-900 mb-1">
                {comparisonData.winner === 'DCA' ? 'DCA Outperformed' : 'Lump Sum Outperformed'}
              </div>
              <div class="text-lg text-gray-700">
                ${comparisonData.difference.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ({comparisonData.differencePercent.toFixed(1)}% difference)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Interpretation -->
      <div class="bg-white border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Analysis Interpretation</h3>
        </div>

        <div class="p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            During the selected period from <strong>{selectedRange.start || tableData[0]?.date}</strong> to
            <strong>{selectedRange.end || tableData[tableData.length - 1]?.date}</strong>,
            the <strong>{comparisonData.winner.toLowerCase()}</strong> strategy achieved superior returns.
          </p>

          <p>
            The dollar cost averaging approach resulted in an average cost basis of
            <strong>${(comparisonData.totalInvested / comparisonData.dcaShares).toFixed(2)}</strong> per share,
            compared to the lump sum entry price of
            <strong>${(comparisonData.totalInvested / comparisonData.lumpSumShares).toFixed(2)}</strong> per share.
            This {(comparisonData.totalInvested / comparisonData.dcaShares) < (comparisonData.totalInvested / comparisonData.lumpSumShares)
              ? 'lower average cost reflects the benefit of purchasing during market downturns'
              : 'higher average cost suggests the market generally trended upward during the investment period'}.
          </p>

          {#if comparisonData.winner === "Lump Sum"}
            <p>
              The lump sum strategy's outperformance typically occurs during sustained bull markets where early
              market exposure maximizes returns. This result suggests the selected period experienced
              predominantly upward price movement with limited volatility that would favor dollar cost averaging.
            </p>
          {:else}
            <p>
              Dollar cost averaging's superior performance indicates the investment period included significant
              market volatility or downturns. By systematically investing fixed amounts, DCA reduced the impact
              of price fluctuations and took advantage of lower prices during market corrections.
            </p>
          {/if}

          <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-200">
            <p class="text-blue-800 text-xs font-medium mb-1">METHODOLOGY NOTE</p>
            <p class="text-blue-700 text-xs">
              This analysis assumes reinvestment of dividends and excludes transaction costs, taxes, and fees.
              Historical performance does not guarantee future results. Both strategies involve market risk.
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
