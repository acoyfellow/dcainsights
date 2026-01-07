<script lang="ts">
  import { page } from '$app/state';
  import PricingPlans from '$lib/components/payments/PricingPlans.svelte';
  import { userStore } from '$lib/stores/user';
  import { onMount } from 'svelte';
  
  let currentTier = $state<'free' | 'pro' | 'premium'>('free');
  let loading = $state(true);
  
  onMount(async () => {
    await userStore.init();
    
    userStore.subscribe(state => {
      if (state.initialized && !state.loading) {
        currentTier = state.user?.tier || 'free';
        loading = false;
      }
    });
  });
  
  async function handleSelectPlan(planId: string, billingInterval: 'monthly' | 'yearly') {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingInterval })
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  }
</script>

<svelte:head>
  <title>Pricing - DCA Insights</title>
  <meta name="description" content="Choose the right DCA Insights plan for your investment journey" />
</svelte:head>

<main class="p-4 md:p-8 max-w-6xl mx-auto">
  {#if loading}
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  {:else}
    <PricingPlans {currentTier} onSelectPlan={handleSelectPlan} />
  {/if}
</main>
