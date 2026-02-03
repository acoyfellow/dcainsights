<script lang="ts">
  import { page } from '$app/state';
  import { userStore } from '$lib/stores/user';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import { Settings, CreditCard, LogOut, User, Crown, Zap } from 'lucide-svelte';
  
  let subscription = $state<{
    tier: string;
    status: string;
    periodEnd: number | null;
  } | null>(null);
  let loading = $state(true);
  let portalLoading = $state(false);
  
  onMount(async () => {
    await userStore.init();
    
    userStore.subscribe(async state => {
      if (state.initialized && !state.loading) {
        if (!state.user) {
          window.location.href = '/auth/login?redirect=/account';
          return;
        }
        
        // Fetch subscription details
        try {
          const response = await fetch('/api/stripe/subscription', {
            headers: { 'Authorization': `Bearer ${state.user}` }
          });
          if (response.ok) {
            subscription = await response.json();
          }
        } catch (error) {
          console.error('Failed to fetch subscription:', error);
        }
        
        loading = false;
      }
    });
  });
  
  async function openBillingPortal() {
    portalLoading = true;
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${get(userStore)?.user}` 
        }
      });
      
      const { url } = await response.json() as { url: string };
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    } finally {
      portalLoading = false;
    }
  }
  
  function formatDate(timestamp: number | null) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function getTierBadge(tier: string) {
    switch (tier) {
      case 'premium':
        return { icon: Crown, color: 'bg-purple-100 text-purple-700', label: 'Premium' };
      case 'pro':
        return { icon: Zap, color: 'bg-blue-100 text-blue-700', label: 'Pro' };
      default:
        return { icon: User, color: 'bg-gray-100 text-gray-700', label: 'Free' };
    }
  }
</script>

<svelte:head>
  <title>Account Settings - DCA Insights</title>
  <meta name="description" content="Manage your DCA Insights account and subscription" />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  {#if loading}
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  {:else}
    <h1 class="text-2xl font-bold mb-8">Account Settings</h1>
    
    <div class="grid gap-6">
      <!-- Subscription Card -->
      <div class="border border-gray-200 rounded-xl p-6 bg-white">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium flex items-center gap-2">
            <CreditCard class="w-5 h-5" />
            Subscription
          </h2>
          
          {#if subscription}
            {@const badge = getTierBadge(subscription.tier)}
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium {badge.color}">
              <badge.icon class="w-4 h-4" />
              {badge.label}
            </span>
          {/if}
        </div>
        
        {#if subscription}
          <div class="space-y-4">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Status</span>
              <span class="font-medium capitalize">{subscription.status}</span>
            </div>
            
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Current Period Ends</span>
              <span class="font-medium">{formatDate(subscription.periodEnd)}</span>
            </div>
            
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Plan Type</span>
              <span class="font-medium capitalize">{subscription.tier}</span>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-100">
            <button
              onclick={openBillingPortal}
              disabled={portalLoading}
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {#if portalLoading}
                <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              {:else}
                Manage Billing
              {/if}
            </button>
            <p class="text-sm text-gray-500 mt-2">
              Update payment method, view invoices, or cancel subscription
            </p>
          </div>
        {:else}
          <p class="text-gray-600 mb-4">No subscription found.</p>
          
          <a
            href="/pricing"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Plans
          </a>
        {/if}
      </div>
      
      <!-- Account Info -->
      <div class="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 class="text-lg font-medium flex items-center gap-2 mb-6">
          <User class="w-5 h-5" />
          Account Information
        </h2>
        
        <div class="space-y-4">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Email</span>
            <span class="font-medium">{get(userStore)?.user?.email || 'Not signed in'}</span>
          </div>
          
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Account Type</span>
            <span class="font-medium capitalize">{get(userStore)?.user?.tier || 'Free'}</span>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 class="text-lg font-medium flex items-center gap-2 mb-6">
          <Settings class="w-5 h-5" />
          Actions
        </h2>
        
        <div class="space-y-4">
          <button
            onclick={() => userStore.logout()}
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut class="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>
