<script lang="ts">
  import { page } from "$app/state";
  import {
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    Share,
    ChevronDown,
    Download,
    Lock,
    Mail,
    X,
  } from "lucide-svelte";
  import DCAChart from "$lib/components/DCAChart.svelte";
  import { addToast } from "$lib/state.svelte";
  import { isPro } from "$lib/stores/user";
  import { startOfMonth, startOfWeek, startOfYear } from "date-fns";

  type Interval = 'daily' | 'weekly' | 'monthly' | 'annually';
  type TableRow = {
    date: string;
    value: string;
    invested: number;
    shares: string;
    totalShares: string;
    avgCost: string;
  };

  let { data } = $props();
  let investmentAmount = $state<number>(Number(page.url.searchParams.get("amount")) || 100);
  let selectedInterval = $state<Interval>(
    (page.url.searchParams.get("interval") as Interval) || "monthly",
  );
  let sortColumn = $state(page.url.searchParams.get("sort") || "");
  let sortDirection = $state(page.url.searchParams.get("dir") || "asc");
  let selectedRange = $state<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  let tableData = $derived.by((): TableRow[] => {
    // Group data by interval
    const groupedData = data.parsedData.reduce((acc: Record<string, any>, item: any) => {
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

    const filteredData: any[] = Object.values(groupedData);

    let runningShares = 0;
    return filteredData.map((item: any, index: number) => {
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
      (a, b) => multiplier * ((a as any)[sortColumn] > (b as any)[sortColumn] ? 1 : -1),
    );
  });

  let summary = $derived.by(() => {
    if (!selectedRange.start) {
      const lastEntry = tableData.at(-1);
      return {
        invested: lastEntry?.invested ?? 0,
        totalShares: Number(lastEntry?.totalShares) || 0,
        currentValue:
          (Number(lastEntry?.totalShares) * Number(lastEntry?.value)) || 0,
      };
    }

    return getFilteredSummary();
  });

  async function copyShareUrl() {
    try {
      // Create shareable report link using KV storage
      const scenario = {
        a: investmentAmount, // amount
        i: selectedInterval, // interval
        s: sortColumn || "", // sort column
        d: sortDirection || "asc", // sort direction
      };

      // Generate a unique ID for the report
      const reportId = crypto.randomUUID();

      // Save to KV storage
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reportId,
          data: scenario,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save report");
      }

      const result = await response.json() as { id: string };
      
      // Use the report ID for the shareable URL
      const url = `${page.url.origin}${page.url.pathname}?report=${result.id}`;

      if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(url);
        addToast("Report link copied!");
      }
    } catch (error) {
      console.error("Failed to copy URL:", error);
      addToast("Failed to copy link", "error");
    }
  }

  // Load report from KV storage using URL parameter
  async function loadReportFromUrl() {
    const reportId = page.url.searchParams.get("report");
    if (!reportId) return false;

    try {
      const response = await fetch(`/api/reports?id=${reportId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Report not found");
          return false;
        }
        throw new Error("Failed to load report");
      }

      const result = await response.json() as { data: { a?: number; i?: string; s?: string; d?: string } };
      const scenario = result.data;

      investmentAmount = scenario.a || 100;
      selectedInterval = (scenario.i as Interval) || "monthly";
      sortColumn = scenario.s || "";
      sortDirection = scenario.d || "asc";
      return true;
    } catch {
      console.error("Failed to load report");
      return false;
    }
  }

  let reportLoaded = $state(false);
  let reportLoadedMessage = $derived.by(() => {
    if (!page.url.searchParams.get("report")) return false;
    if (reportLoaded) return true;
    loadReportFromUrl().then(loaded => { reportLoaded = loaded; });
    return reportLoaded;
  });

  // Email capture modal state
  let showEmailModal = $state(false);
  let emailInput = $state("");
  let emailSubmitting = $state(false);
  let emailSubscribed = $state(false);

  async function handleEmailSubmit() {
    if (!emailInput || emailSubmitting) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    emailSubmitting = true;

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          tier: $isPro ? "pro" : "free"
        }),
      });

      const result = await response.json() as { success: boolean; message?: string };

      if (result.success) {
        emailSubscribed = true;
        addToast(result.message || "Report will be emailed to you!");
        setTimeout(() => {
          showEmailModal = false;
          emailSubscribed = false;
          emailInput = "";
        }, 2000);
      } else {
        addToast(result.message || "Subscription failed", "error");
      }
    } catch {
      addToast("Failed to subscribe. Please try again.", "error");
    } finally {
      emailSubmitting = false;
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

  // Track conversion events
  async function trackEvent(type: string, data?: Record<string, unknown>) {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          tool: "sp500-dca-calculator",
          metadata: data,
        }),
      });
    } catch (e) {
      console.error("Failed to track event:", e);
    }
  }

  // Track page view on mount
  $effect(() => {
    trackEvent("view_tool", { path: page.url.pathname });
  });

  function exportToCSV() {
    if (!$isPro) {
      trackEvent("checkout_start", { reason: "export_click_free", upgradeTo: "pro" });
      window.location.href = "/pricing?upgrade=export";
      return;
    }

    trackEvent("export_click", { tier: "pro" });

    const headers = ["Date", "Price", "Total Invested", "Shares Bought", "Total Shares", "Avg Cost/Share"];
    const rows = tableData.map((row) => [
      row.date,
      row.value,
      row.invested,
      row.shares,
      row.totalShares,
      row.avgCost,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dca-results-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast("CSV downloaded successfully!");
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

{#if reportLoadedMessage}
  <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p class="font-medium text-green-800">Report loaded from shared link</p>
        <p class="text-sm text-green-600">Scenario parameters have been applied</p>
      </div>
    </div>
    <a
      href={page.url.pathname}
      class="text-sm text-green-700 hover:text-green-800 font-medium"
    >
      Clear & start fresh
    </a>
  </div>
{/if}

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
    <div class="flex items-center gap-2">
      <button
        onclick={exportToCSV}
        class="border {$isPro ? 'border-gray-300 hover:bg-gray-100' : 'border-orange-300 bg-orange-50 hover:bg-orange-100'} h-12 px-4 flex items-center gap-2 transition-colors"
        title={$isPro ? "Export results to CSV" : "Upgrade to Pro to export"}
      >
        {#if $isPro}
          <Download class="w-4 h-4" />
        {:else}
          <Lock class="w-4 h-4 text-orange-600" />
        {/if}
        <span class="text-sm {$isPro ? '' : 'text-orange-700 font-medium'}">Export CSV</span>
      </button>
      <button
        onclick={() => showEmailModal = true}
        class="border border-gray-300 h-12 px-4 hover:bg-gray-100 flex items-center gap-2"
        title="Email me this report"
      >
        <Mail class="w-4 h-4" />
        <span class="text-sm">Email Report</span>
      </button>
      <button
        onclick={copyShareUrl}
        class="border border-gray-300 h-12 px-4 hover:bg-gray-100 flex items-center gap-2"
      >
        <span class="text-sm">Share</span>
        <Share class="w-4 h-4" />
      </button>
    </div>
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

  <div class="overflow-x-auto border border-gray-300 max-h-[500px] overflow-y-auto">
    <div class="min-w-[700px]">
      <!-- Sticky Header -->
      <div class="sticky top-0 bg-white z-10">
        <div
          class="grid grid-cols-6 divide-x divide-gray-300 border-collapse border-b border-gray-300"
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

      <!-- Table Body -->
      {#each sortedTableData as row, index (index)}
        <div class="border-b border-gray-300 min-w-[700px]">
          <div
            class="grid grid-cols-6 border-gray-300 font-light text-xs divide-x divide-gray-300 border-collapse"
          >
            <div class="p-2 whitespace-nowrap">
              {row.date}
            </div>
            <div class="p-2">
              {Number(row.value).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div class="p-2">
              {Number(row.invested).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div class="p-2">
              {Number(row.shares).toLocaleString("en-US", {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </div>
            <div class="p-2">
              {Number(row.totalShares).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                },
              )}
            </div>
            <div class="p-2">
              {Number(row.avgCost).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      {/each}
    </div>
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

  <!-- Email Capture Modal -->
  {#if showEmailModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onclick={() => showEmailModal = false}
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X class="w-5 h-5" />
        </button>

        <h3 class="text-xl font-bold mb-2">Email Me This Report</h3>
        <p class="text-gray-600 mb-6">
          Enter your email to receive this DCA analysis with all the details.
        </p>

        {#if emailSubscribed}
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-green-800 font-medium">You're subscribed!</span>
            </div>
          </div>
        {:else}
          <form
            onsubmit={(e) => {
              e.preventDefault();
              handleEmailSubmit();
            }}
            class="space-y-4"
          >
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                bind:value={emailInput}
                placeholder="you@example.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                disabled={emailSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={emailSubmitting || !emailInput}
              class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {#if emailSubmitting}
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Subscribing...
              {:else}
                <Mail class="w-5 h-5" />
                Send Report to My Email
              {/if}
            </button>
          </form>
        {/if}

        <p class="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  {/if}
</main>
