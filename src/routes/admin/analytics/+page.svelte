<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowUp, ArrowDown, Users, DollarSign, MousePointer, ShoppingCart } from 'lucide-svelte';
  
  let stats = $state({
    mrr: 0,
    mrrChange: 0,
    subscribers: 0,
    subscriberChange: 0,
    views: 0,
    viewChange: 0,
    conversions: 0,
    conversionChange: 0
  });
  
  let events = $state<Array<{ type: string; count: number; timestamp: number }>>([]);
  let loading = $state(true);
  
  onMount(async () => {
    // Fetch events from API (in production, this would aggregate KV data)
    try {
      const response = await fetch('/api/events?type=view_tool&limit=100');
      const data = await response.json() as { events?: { type: string }[] };
      
      // Calculate stats from events
      const eventCounts = new Map<string, number>();
      data.events?.forEach((e: { type: string }) => {
        eventCounts.set(e.type, (eventCounts.get(e.type) || 0) + 1);
      });
      
      events = Array.from(eventCounts.entries()).map(([type, count]) => ({
        type,
        count,
        timestamp: Date.now()
      }));
      
      // Mock MRR data (would come from Stripe API in production)
      stats = {
        mrr: 0, // Start at 0, grow from real subscriptions
        mrrChange: 0,
        subscribers: 0,
        subscriberChange: 0,
        views: eventCounts.get('view_tool') || 0,
        viewChange: 12, // Mock growth %
        conversions: eventCounts.get('purchase') || 0,
        conversionChange: 0
      };
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      loading = false;
    }
  });
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  function formatNumber(num: number) {
    return new Intl.NumberFormat('en-US').format(num);
  }
  
  // Mock funnel data for demo
  const funnelData = [
    { stage: 'Visitors', count: 1000, percent: 100 },
    { stage: 'Signups', count: 50, percent: 5 },
    { stage: 'Activated', count: 30, percent: 3 },
    { stage: 'Trial Started', count: 15, percent: 1.5 },
    { stage: 'Paid', count: 5, percent: 0.5 }
  ];
  
  // MRR growth projection
  const mrrProjection = [
    { month: 'Month 1', mrr: 500 },
    { month: 'Month 2', mrr: 2500 },
    { month: 'Month 3', mrr: 8000 },
    { month: 'Month 6', mrr: 50000 },
    { month: 'Month 12', mrr: 1000000 }
  ];
</script>

<svelte:head>
  <title>Analytics Dashboard - DCA Insights</title>
</svelte:head>

<main class="p-4 md:p-8 max-w-7xl mx-auto">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Revenue Analytics</h1>
    <p class="text-gray-600">Track your MRR growth and conversion funnel</p>
  </div>
  
  <!-- MRR Display -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
    <div class="flex items-center gap-3 mb-2">
      <DollarSign class="w-8 h-8" />
      <span class="text-blue-100 font-medium">Monthly Recurring Revenue</span>
    </div>
    <div class="text-6xl font-bold mb-4">
      {formatCurrency(stats.mrr)}
    </div>
    <div class="flex items-center gap-2 text-blue-100">
      {#if stats.mrrChange >= 0}
        <ArrowUp class="w-4 h-4 text-green-300" />
        <span class="text-green-300">+{stats.mrrChange}%</span>
      {:else}
        <ArrowDown class="w-4 h-4 text-red-300" />
        <span class="text-red-300">{stats.mrrChange}%</span>
      {/if}
      <span>from last month</span>
    </div>
  </div>
  
  <!-- Stats Grid -->
  <div class="grid md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-blue-100 rounded-lg">
          <Users class="w-5 h-5 text-blue-600" />
        </div>
        <span class="text-gray-600 text-sm">Active Subscribers</span>
      </div>
      <div class="text-3xl font-bold">{formatNumber(stats.subscribers)}</div>
      <div class="text-sm text-gray-500 mt-1">
        {#if stats.subscriberChange >= 0}
          <span class="text-green-600">+{stats.subscriberChange}%</span>
        {:else}
          <span class="text-red-600">{stats.subscriberChange}%</span>
        {/if}
        this month
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-green-100 rounded-lg">
          <MousePointer class="w-5 h-5 text-green-600" />
        </div>
        <span class="text-gray-600 text-sm">Tool Views</span>
      </div>
      <div class="text-3xl font-bold">{formatNumber(stats.views)}</div>
      <div class="text-sm text-gray-500 mt-1">
        {#if stats.viewChange >= 0}
          <span class="text-green-600">+{stats.viewChange}%</span>
        {:else}
          <span class="text-red-600">{stats.viewChange}%</span>
        {/if}
        this month
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-purple-100 rounded-lg">
          <ShoppingCart class="w-5 h-5 text-purple-600" />
        </div>
        <span class="text-gray-600 text-sm">Conversions</span>
      </div>
      <div class="text-3xl font-bold">{formatNumber(stats.conversions)}</div>
      <div class="text-sm text-gray-500 mt-1">
        {#if stats.conversionChange >= 0}
          <span class="text-green-600">+{stats.conversionChange}%</span>
        {:else}
          <span class="text-red-600">{stats.conversionChange}%</span>
        {/if}
        this month
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-orange-100 rounded-lg">
          <DollarSign class="w-5 h-5 text-orange-600" />
        </div>
        <span class="text-gray-600 text-sm">Avg Revenue/User</span>
      </div>
      <div class="text-3xl font-bold">
        {stats.subscribers > 0 ? formatCurrency(stats.mrr / stats.subscribers) : '$0'}
      </div>
      <div class="text-sm text-gray-500 mt-1">Lifetime value</div>
    </div>
  </div>
  
  <!-- Conversion Funnel -->
  <div class="bg-white rounded-xl p-6 border border-gray-200 mb-8">
    <h2 class="text-xl font-bold mb-6">Conversion Funnel</h2>
    
    <div class="space-y-4">
      {#each funnelData as stage, i}
        <div class="relative">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium">{stage.stage}</span>
            <span class="text-gray-600">{formatNumber(stage.count)} ({stage.percent}%)</span>
          </div>
          <div class="h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div 
              class="h-full bg-blue-500 rounded-lg transition-all duration-500"
              style="width: {stage.percent * 2}%"
            ></div>
          </div>
          {#if i < funnelData.length - 1}
            <div class="absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-400">
              ↓
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
    <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
      <p class="text-yellow-800 text-sm">
        <strong>Funnel Insight:</strong> 
        {#if funnelData[0].count > 0}
          Your conversion rate from visitor to paid subscriber is {((funnelData[4].count / funnelData[0].count) * 100).toFixed(2)}%.
          {#if funnelData[4].count / funnelData[0].count < 0.01}
            Focus on improving the signup → checkout flow.
          {:else}
            Strong funnel! Focus on driving more traffic.
          {/if}
        {:else}
          Start driving traffic to see your conversion funnel in action.
        {/if}
      </p>
    </div>
  </div>
  
  <!-- MRR Projection -->
  <div class="bg-white rounded-xl p-6 border border-gray-200">
    <h2 class="text-xl font-bold mb-6">Path to $1M MRR</h2>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left text-gray-500 text-sm border-b">
            <th class="pb-3 font-medium">Milestone</th>
            <th class="pb-3 font-medium">Target MRR</th>
            <th class="pb-3 font-medium">Subscribers (@ $297)</th>
            <th class="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each mrrProjection as milestone}
            <tr class="border-b border-gray-100">
              <td class="py-4 font-medium">{milestone.month}</td>
              <td class="py-4">{formatCurrency(milestone.mrr)}</td>
              <td class="py-4">{Math.round(milestone.mrr / 297).toLocaleString()}</td>
              <td class="py-4">
                {#if milestone.mrr <= stats.mrr}
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    ✓ Achieved
                  </span>
                {:else}
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    In Progress
                  </span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <p class="text-blue-800 text-sm">
        <strong>Goal:</strong> $1M MRR = {Math.round(1000000 / 297).toLocaleString()} subscribers at $297/month.
        <br />
        <span class="text-blue-600">
          Current progress: {stats.mrr > 0 ? ((stats.mrr / 1000000) * 100).toFixed(4) : 0}% of goal achieved
        </span>
      </p>
    </div>
  </div>
</main>
