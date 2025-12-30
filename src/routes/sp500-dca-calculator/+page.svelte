<script lang="ts">
  import { page } from "$app/state";
  import VirtualList from "svelte-tiny-virtual-list";
  import {
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    Share,
    ChevronDown,
  } from "lucide-svelte";
  import DCAChart from "$lib/components/DCAChart.svelte";
  import { addToast } from "$lib/state.svelte";
  import { startOfMonth, startOfWeek, startOfYear } from "date-fns";

  let { data } = $props();
  let investmentAmount = $state(page.url.searchParams.get("amount") || 100);
  let selectedInterval = $state<Interval>(
    (page.url.searchParams.get("interval") as Interval) || "monthly",
  );
  let sortColumn = $state(page.url.searchParams.get("sort") || "");
  let sortDirection = $state(page.url.searchParams.get("dir") || "asc");
  let selectedRange = $state<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  let tableData = $derived.by(() => {
    // Group data by interval
    const groupedData = data.parsedData.reduce((acc, item) => {
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
    return filteredData.map((item, index) => {
      const shares = investmentAmount / Number(item.value);
      runningShares += shares;
      const invested = (index + 1) * investmentAmount;

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

  let sortedTableData = $derived.by(() => {
    if (!sortColumn) return [...tableData];
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return [...tableData].sort(
      (a, b) => multiplier * (a[sortColumn] > b[sortColumn] ? 1 : -1),
    );
  });

  let summary = $derived.by(() => {
    if (!selectedRange.start) {
      const lastEntry = tableData.at(-1);
      return {
        invested: lastEntry?.invested ?? 0,
        totalShares: Number(lastEntry?.totalShares) ?? 0,
        currentValue:
          Number(lastEntry?.totalShares) * Number(lastEntry?.value) ?? 0,
      };
    }

    return getFilteredSummary();
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

  function toggleSort(column) {
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

  function getFilteredSummary() {
    if (!selectedRange.start || !selectedRange.end) return null;

    const startIndex = tableData.findIndex(
      (d) => d.date === selectedRange.start,
    );
    const endIndex = tableData.findIndex((d) => d.date === selectedRange.end);

    if (startIndex === -1 || endIndex === -1) return null;

    const rangeData = tableData.slice(startIndex, endIndex + 1);
    const lastEntry = rangeData[rangeData.length - 1];

    return {
      invested:
        lastEntry.invested -
        (startIndex > 0 ? tableData[startIndex - 1].invested : 0),
      totalShares:
        Number(lastEntry.totalShares) -
        (startIndex > 0 ? Number(tableData[startIndex - 1].totalShares) : 0),
      currentValue:
        (Number(lastEntry.totalShares) -
          (startIndex > 0
            ? Number(tableData[startIndex - 1].totalShares)
            : 0)) *
        Number(lastEntry.value),
    };
  }
</script>

<svelte:head>
  <title>S&P 500 DCA Calculator</title>
  <meta
    name="description"
    content="S&P 500 DCA Calculator - Dollar Cost Averaging (DCA) is an investment strategy where you invest a fixed amount of money at regular intervals."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="flex items-center justify-between pb-3">
    <div>
      <h1 class="text-2xl text-balance font-medium">
        S&P 500 Dollar Cost Averaging (DCA) Calculator
      </h1>
      {#if data.metadata?.lastUpdated}
        <p class="text-xs text-gray-500 mt-1">
          Last updated {data.metadata.lastUpdated} • Source {data.metadata.source}
        </p>
      {/if}
    </div>
    <button
      onclick={copyShareUrl}
      class="border border-gray-300 h-12 px-4 hover:bg-gray-100 flex items-center gap-2"
    >
      <span class="text-sm">Share</span>
      <Share class="w-4 h-4" />
    </button>
  </div>
  <p class="text-base md:text-lg mb-8 text-gray-600 leading-relaxed font-light">
    Dollar Cost Averaging (DCA) is an investment strategy where you invest a
    fixed amount of money at regular intervals, regardless of the asset's price.
    This calculator shows how investing the same amount regularly into the S&P
    500 would have performed historically, helping demonstrate how DCA can help
    reduce the impact of market volatility over time.
  </p>

  <div
    class="grid md:grid-cols-2 gap-8 mb-8 bg-white border border-gray-300 p-6"
  >
    <!-- Left Column: Investment Controls -->
    <div class="">
      <div class="space-y-10">
        <div class="space-y-2">
          <h2 class="font-medium">Investment Amount Per Period</h2>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >$</span
            >
            <input
              type="number"
              bind:value={investmentAmount}
              class="w-full p-2 pl-8 border border-gray-200 rounded-lg outline-none"
              min="1"
              max="1000000"
            />
          </div>
          <p class="text-gray-600 font-light">
            Enter the amount you want to invest at each interval
          </p>
        </div>

        <div class="space-y-2">
          <h2 class="font-medium">
            Investment Interval ({selectedInterval})
          </h2>
          <div class="relative">
            <select
              bind:value={selectedInterval}
              class="w-full p-2 border border-gray-200 rounded-lg outline-none appearance-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <ChevronDown class="w-5 h-5" />
            </span>
          </div>
          <p class="text-gray-600 font-light">
            Select how often you want to invest
          </p>
        </div>
      </div>
    </div>

    <!-- Right Column: Investment Summary -->
    <div class="bg-zinc-50 rounded-lg p-6">
      <h2 class="font-medium mb-4">Investment Summary</h2>
      <p class="font-light mb-6">
        If you had invested <strong class="font-medium"
          >${investmentAmount.toLocaleString()}</strong
        >
        {selectedInterval} from
        <strong class="font-medium"
          >{selectedRange.start || tableData[0]?.date}</strong
        >
        to
        <strong class="font-medium"
          >{selectedRange.end || tableData[tableData.length - 1]?.date}</strong
        >, you would have:
      </p>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 text-lg">Total Invested:</span>
          <span class="text-lg font-medium">
            ${(
              summary?.invested ||
              tableData[tableData.length - 1]?.invested ||
              0
            ).toLocaleString()}
          </span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-gray-600 text-lg">Accumulated Shares:</span>
          <span class="text-lg font-medium">
            {(
              summary?.totalShares ||
              Number(tableData[tableData.length - 1]?.totalShares) ||
              0
            ).toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
          </span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-gray-600 text-lg">Current Value:</span>
          <span class="text-lg font-medium">
            ${(
              summary?.currentValue ||
              Number(tableData[tableData.length - 1]?.totalShares) *
                Number(tableData[tableData.length - 1]?.value) ||
              0
            ).toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="border border-gray-300 pb-10 mb-10">
    <DCAChart
      data={tableData}
      {investmentAmount}
      onRangeSelect={handleRangeSelect}
    />
  </div>

  <div class="overflow-x-auto border border-gray-300">
    <VirtualList
      width="100%"
      height={400}
      itemCount={sortedTableData.length}
      itemSize={33}
    >
      <div slot="header" class="sticky top-0 bg-white z-10">
        <div
          class="grid grid-cols-6 divide-x divide-gray-300 border-collapse min-w-[700px] border-b border-gray-300"
        >
          {#each columns as column}
            <button
              type="button"
              class="p-2 text-left hover:bg-gray-200 whitespace-nowrap text-xs font-medium {sortColumn ===
              column.key
                ? 'bg-blue-50'
                : 'bg-gray-100'}"
              onclick={() => toggleSort(column.key)}
              onkeydown={(e) => e.key === "Enter" && toggleSort(column.key)}
            >
              <div class="flex items-center gap-1">
                {column.label}
                {#if sortColumn === column.key}
                  {#if sortDirection === "asc"}
                    <ArrowUpNarrowWide class="w-4 h-4" />
                  {:else}
                    <ArrowDownWideNarrow class="w-4 h-4" />
                  {/if}
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>

      {#snippet item({ index, style })}
        <div {style} class="border-b border-gray-300 min-w-[700px]">
          <div
            class="grid grid-cols-6 border-gray-300 font-light text-xs divide-x divide-gray-300 border-collapse"
          >
            <div class="p-2 whitespace-nowrap">
              {sortedTableData[index].date}
            </div>
            <div class="p-2">
              {Number(sortedTableData[index].value).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div class="p-2">
              {Number(sortedTableData[index].invested).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div class="p-2">
              {Number(sortedTableData[index].shares).toLocaleString("en-US", {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </div>
            <div class="p-2">
              {Number(sortedTableData[index].totalShares).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                },
              )}
            </div>
            <div class="p-2">
              {Number(sortedTableData[index].avgCost).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      {/snippet}
    </VirtualList>
  </div>
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
