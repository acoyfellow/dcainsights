<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>DCA Insights - Dollar Cost Averaging Investment Tools</title>
  <meta
    name="description"
    content="Tools to analyze and understand Dollar Cost Averaging (DCA) investment strategies across different market indices and scenarios."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <h1 class="text-2xl md:text-4xl mb-8">DCA Insights</h1>
  <p class="text-gray-600 mb-8">
    Tools to analyze and understand Dollar Cost Averaging (DCA) investment
    strategies across different market indices and scenarios.
  </p>

  <div class="grid gap-6">
    <a
      href="/sp500-dca-calculator"
      class="p-6 border border-gray-300 hover:border-gray-400 flex items-center justify-between gap-4 relative"
    >
      <div>
        <h2 class="text-xl font-medium mb-2">S&P 500 DCA Calculator</h2>
        <p class="text-gray-600">
          Calculate how Dollar Cost Averaging into the S&P 500 would have
          performed historically. Analyze different investment amounts and time
          periods.
        </p>
      </div>

      <ChevronRight class="w-4 h-4 flex-none text-gray-500" />
    </a>

    <a
      href="/dca-vs-lump-sum"
      class="p-6 border border-gray-300 hover:border-gray-400 flex items-center justify-between gap-4 relative"
    >
      <div>
        <h2 class="text-xl font-medium mb-2">DCA vs Lump Sum Calculator</h2>
        <p class="text-gray-600">
          Compare Dollar Cost Averaging against investing the same total amount
          as a lump sum. See which strategy would have performed better
          historically in the S&P 500.
        </p>
      </div>

      <ChevronRight class="w-4 h-4 flex-none text-gray-500" />
    </a>

    <a
      href="/dca-timing-optimizer"
      class="p-6 border border-gray-300 hover:border-gray-400 flex items-center justify-between gap-4 relative"
    >
      <div>
        <h2 class="text-xl font-medium mb-2">DCA Timing Optimizer</h2>
        <p class="text-gray-600">
          Statistical analysis of optimal investment timing for Dollar Cost
          Averaging. Discover which days of the month and week historically
          produced the best DCA returns.
        </p>
      </div>

      <ChevronRight class="w-4 h-4 flex-none text-gray-500" />
    </a>

    <a
      href="/bear-market-dca"
      class="p-6 border border-gray-300 hover:border-gray-400 flex items-center justify-between gap-4 relative"
    >
      <div>
        <h2 class="text-xl font-medium mb-2">Bear Market DCA Analysis</h2>
        <p class="text-gray-600">
          Comprehensive analysis of Dollar Cost Averaging performance during S&P
          500 bear markets. Study how DCA strategies performed during major
          market downturns and crashes.
        </p>
      </div>

      <ChevronRight class="w-4 h-4 flex-none text-gray-500" />
    </a>

    <a
      href="/recession-dca"
      class="p-6 border border-gray-300 hover:border-gray-400 flex items-center justify-between gap-4 relative"
    >
      <div>
        <h2 class="text-xl font-medium mb-2">DCA During Recessions</h2>
        <p class="text-gray-600">
          Academic analysis of Dollar Cost Averaging during official US
          recession periods. Study systematic investment performance during
          economic contractions and recoveries.
        </p>
      </div>

      <ChevronRight class="w-4 h-4 flex-none text-gray-500" />
    </a>

    <!-- Future DCA tools:
    - Bitcoin/Crypto DCA
    - NASDAQ DCA
    - Global Markets DCA
    - etc.
    -->
  </div>
</main>
