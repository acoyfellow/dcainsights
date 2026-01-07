<script lang="ts">
  import { SUBSCRIPTION_PLANS, type SubscriptionTier } from '$lib/types';
  import { Check, Loader2 } from 'lucide-svelte';
  
  let { 
    currentTier = 'free',
    onSelectPlan 
  }: { 
    currentTier?: SubscriptionTier | 'free';
    onSelectPlan?: (planId: string, billingInterval: 'monthly' | 'yearly') => void;
  } = $props();
  
  let billingInterval = $state<'monthly' | 'yearly'>('monthly');
  let loading = $state<string | null>(null);
  
  async function handleSelectPlan(planId: string) {
    if (currentTier === planId) return;
    
    if (onSelectPlan) {
      loading = planId;
      try {
        await onSelectPlan(planId, billingInterval);
      } finally {
        loading = null;
      }
    } else {
      // Default behavior - redirect to checkout
      window.location.href = `/api/stripe/checkout?plan=${planId}&interval=${billingInterval}`;
    }
  }
  
  function formatPrice(price: number) {
    return (price / 100).toFixed(2);
  }
  
  function getSavings(monthlyPrice: number, yearlyPrice: number) {
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100);
  }
</script>

<div class="py-12">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-bold mb-4">Choose Your Investment Journey</h2>
    <p class="text-gray-600 max-w-2xl mx-auto">
      Start with our free tools, then unlock powerful insights as you grow.
      Upgrade anytime as your investment knowledge expands.
    </p>
    
    <div class="flex items-center justify-center gap-4 mt-6">
      <button
        onclick={() => billingInterval = 'monthly'}
        class="px-4 py-2 rounded-lg transition-colors {billingInterval === 'monthly' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
      >
        Monthly
      </button>
      <button
        onclick={() => billingInterval = 'yearly'}
        class="px-4 py-2 rounded-lg transition-colors {billingInterval === 'yearly' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
      >
        Yearly
        <span class="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          Save 17%
        </span>
      </button>
    </div>
  </div>
  
  <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
    <!-- Free Plan -->
    <div class="border border-gray-200 rounded-xl p-6 bg-white hover:border-gray-300 transition-colors">
      <h3 class="text-xl font-bold mb-2">Free</h3>
      <p class="text-gray-600 mb-4 text-sm">Perfect for getting started</p>
      <div class="mb-6">
        <span class="text-4xl font-bold">$0</span>
        <span class="text-gray-500">/month</span>
      </div>
      
      <ul class="space-y-3 mb-8">
        <li class="flex items-start gap-2">
          <Check class="w-5 h-5 text-green-500 flex-none" />
          <span class="text-sm">Basic DCA Calculator</span>
        </li>
        <li class="flex items-start gap-2">
          <Check class="w-5 h-5 text-green-500 flex-none" />
          <span class="text-sm">Share Results</span>
        </li>
        <li class="flex items-start gap-2">
          <Check class="w-5 h-5 text-green-500 flex-none" />
          <span class="text-sm">Historical Data Access</span>
        </li>
      </ul>
      
      <button
        disabled
        class="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
      >
        Current Plan
      </button>
    </div>
    
    <!-- Pro Plan -->
    <div class="border-2 border-blue-500 rounded-xl p-6 bg-white relative shadow-lg">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Most Popular
      </div>
      
      <h3 class="text-xl font-bold mb-2">Pro</h3>
      <p class="text-gray-600 mb-4 text-sm">For serious investors</p>
      <div class="mb-6">
        <span class="text-4xl font-bold">${formatPrice(SUBSCRIPTION_PLANS.pro.priceMonthly)}</span>
        <span class="text-gray-500">/month</span>
        {#if billingInterval === 'yearly'}
          <p class="text-sm text-green-600 mt-1">
            ${formatPrice(SUBSCRIPTION_PLANS.pro.priceYearly / 12)}/month billed yearly
          </p>
        {/if}
      </div>
      
      <ul class="space-y-3 mb-8">
        {#each SUBSCRIPTION_PLANS.pro.features as feature}
          <li class="flex items-start gap-2">
            <Check class="w-5 h-5 text-blue-500 flex-none" />
            <span class="text-sm">{feature}</span>
          </li>
        {/each}
      </ul>
      
      <button
        onclick={() => handleSelectPlan('pro')}
        disabled={currentTier === 'pro' || loading === 'pro'}
        class="w-full py-3 px-4 rounded-lg font-medium transition-colors {
          currentTier === 'pro' 
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }"
      >
        {#if loading === 'pro'}
          <Loader2 class="w-5 h-5 animate-spin mx-auto" />
        {:else if currentTier === 'pro'}
          Current Plan
        {:else}
          Get Pro
        {/if}
      </button>
    </div>
    
    <!-- Premium Plan -->
    <div class="border border-gray-200 rounded-xl p-6 bg-white hover:border-gray-300 transition-colors">
      <h3 class="text-xl font-bold mb-2">Premium</h3>
      <p class="text-gray-600 mb-4 text-sm">For professionals & advisors</p>
      <div class="mb-6">
        <span class="text-4xl font-bold">${formatPrice(SUBSCRIPTION_PLANS.premium.priceMonthly)}</span>
        <span class="text-gray-500">/month</span>
        {#if billingInterval === 'yearly'}
          <p class="text-sm text-green-600 mt-1">
            ${formatPrice(SUBSCRIPTION_PLANS.premium.priceYearly / 12)}/month billed yearly
          </p>
        {/if}
      </div>
      
      <ul class="space-y-3 mb-8">
        {#each SUBSCRIPTION_PLANS.premium.features as feature}
          <li class="flex items-start gap-2">
            <Check class="w-5 h-5 text-purple-500 flex-none" />
            <span class="text-sm">{feature}</span>
          </li>
        {/each}
      </ul>
      
      <button
        onclick={() => handleSelectPlan('premium')}
        disabled={currentTier === 'premium' || loading === 'premium'}
        class="w-full py-3 px-4 rounded-lg font-medium transition-colors {
          currentTier === 'premium' 
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }"
      >
        {#if loading === 'premium'}
          <Loader2 class="w-5 h-5 animate-spin mx-auto" />
        {:else if currentTier === 'premium'}
          Current Plan
        {:else}
          Get Premium
        {/if}
      </button>
    </div>
  </div>
  
  <p class="text-center text-sm text-gray-500 mt-8">
    All plans include a 14-day money-back guarantee. Cancel anytime.
  </p>
</div>
