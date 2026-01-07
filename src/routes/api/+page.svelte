<script lang="ts">
  import { Terminal, Lock, Zap, ChevronRight, Code, Database, Globe } from 'lucide-svelte';
</script>

<svelte:head>
  <title>API Documentation - DCA Insights</title>
  <meta name="description" content="Build on top of DCA Insights with our developer API" />
</svelte:head>

<main class="p-4 md:p-8 max-w-6xl mx-auto">
  <div class="text-center mb-12">
    <Terminal class="w-16 h-16 text-blue-600 mx-auto mb-6" />
    <h1 class="text-3xl font-bold mb-4">DCA Insights API</h1>
    <p class="text-gray-600 max-w-2xl mx-auto">
      Build powerful investment applications using our historical data and DCA calculations.
      Programmatic access to our calculators, market data, and analysis tools.
    </p>
  </div>
  
  <!-- API Plans -->
  <div class="grid md:grid-cols-3 gap-6 mb-12">
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-center gap-2 mb-4">
        <Database class="w-6 h-6 text-gray-500" />
        <h3 class="font-bold text-lg">Free Tier</h3>
      </div>
      <p class="text-3xl font-bold mb-4">$0<span class="text-sm font-normal text-gray-500">/month</span></p>
      <ul class="space-y-2 mb-6">
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-green-500" />
          <span>1,000 API calls/month</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-green-500" />
          <span>Basic DCA calculations</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-green-500" />
          <span>Historical S&P 500 data</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-green-500" />
          <span>Community support</span>
        </li>
      </ul>
      <a href="/auth/register?plan=api-free" class="block text-center px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
        Get Started
      </a>
    </div>
    
    <div class="border-2 border-blue-500 rounded-xl p-6 relative">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Most Popular
      </div>
      <div class="flex items-center gap-2 mb-4">
        <Zap class="w-6 h-6 text-blue-500" />
        <h3 class="font-bold text-lg">Developer</h3>
      </div>
      <p class="text-3xl font-bold mb-4">$99<span class="text-sm font-normal text-gray-500">/month</span></p>
      <ul class="space-y-2 mb-6">
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-blue-500" />
          <span>100,000 API calls/month</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-blue-500" />
          <span>All calculation endpoints</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-blue-500" />
          <span>Real-time data access</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-blue-500" />
          <span>Rate limiting: 100 req/min</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-blue-500" />
          <span>Email support</span>
        </li>
      </ul>
      <a href="/auth/register?plan=api-developer" class="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Start Building
      </a>
    </div>
    
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-center gap-2 mb-4">
        <Globe class="w-6 h-6 text-purple-500" />
        <h3 class="font-bold text-lg">Enterprise</h3>
      </div>
      <p class="text-3xl font-bold mb-4">$499<span class="text-sm font-normal text-gray-500">/month</span></p>
      <ul class="space-y-2 mb-6">
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-purple-500" />
          <span>Unlimited API calls</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-purple-500" />
          <span>Custom data exports</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-purple-500" />
          <span>Dedicated infrastructure</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-purple-500" />
          <span>99.99% SLA</span>
        </li>
        <li class="flex items-center gap-2 text-sm">
          <ChevronRight class="w-4 h-4 text-purple-500" />
          <span>24/7 priority support</span>
        </li>
      </ul>
      <a href="/contact?type=enterprise" class="block text-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
        Contact Sales
      </a>
    </div>
  </div>
  
  <!-- API Documentation Preview -->
  <div class="border-t border-gray-200 pt-12">
    <h2 class="text-2xl font-bold mb-6">Available Endpoints</h2>
    
    <div class="space-y-4">
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono font-bold">GET</span>
            <code class="text-sm">/api/v1/dca/calculate</code>
          </div>
          <span class="text-xs text-gray-500">Free tier</span>
        </div>
        <div class="p-4 text-sm text-gray-600">
          Calculate DCA investment returns for a given investment amount and time period.
        </div>
      </div>
      
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono font-bold">POST</span>
            <code class="text-sm">/api/v1/dca/compare</code>
          </div>
          <span class="text-xs text-gray-500">Developer tier</span>
        </div>
        <div class="p-4 text-sm text-gray-600">
          Compare DCA vs Lump Sum strategies across historical data.
        </div>
      </div>
      
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono font-bold">GET</span>
            <code class="text-sm">/api/v1/market/historical</code>
          </div>
          <span class="text-xs text-gray-500">Developer tier</span>
        </div>
        <div class="p-4 text-sm text-gray-600">
          Access historical S&P 500 data and market indicators.
        </div>
      </div>
      
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-mono font-bold">POST</span>
            <code class="text-sm">/api/v1/analysis/scenario</code>
          </div>
          <span class="text-xs text-gray-500">Enterprise tier</span>
        </div>
        <div class="p-4 text-sm text-gray-600">
          Run custom market scenarios and backtest investment strategies.
        </div>
      </div>
    </div>
    
    <div class="mt-6 text-center">
      <a href="/api/docs" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
        <Code class="w-5 h-5" />
        View Full Documentation
      </a>
    </div>
  </div>
  
  <!-- Use Cases -->
  <div class="border-t border-gray-200 pt-12 mt-12">
    <h2 class="text-2xl font-bold mb-6">Build With DCA Insights</h2>
    
    <div class="grid md:grid-cols-3 gap-6">
      <div class="p-6 bg-gray-50 rounded-xl">
        <h3 class="font-bold mb-2">Robo-Advisors</h3>
        <p class="text-sm text-gray-600">
          Integrate DCA calculations into automated investment platforms and portfolio management tools.
        </p>
      </div>
      
      <div class="p-6 bg-gray-50 rounded-xl">
        <h3 class="font-bold mb-2">Financial Apps</h3>
        <p class="text-sm text-gray-600">
          Add investment tracking and analysis features to personal finance and banking applications.
        </p>
      </div>
      
      <div class="p-6 bg-gray-50 rounded-xl">
        <h3 class="font-bold mb-2">Educational Platforms</h3>
        <p class="text-sm text-gray-600">
          Build interactive investing courses with real historical data and DCA simulations.
        </p>
      </div>
    </div>
  </div>
</main>
