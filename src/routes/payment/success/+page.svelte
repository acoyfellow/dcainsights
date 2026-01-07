<script lang="ts">
  import { page } from '$app/state';
  import { CheckCircle, ArrowRight } from 'lucide-svelte';
  import { userStore } from '$lib/stores/user';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let sessionId = $state('');
  let token = $state('');
  let loading = $state(true);
  let success = $state(false);
  
  onMount(async () => {
    if (browser) {
      sessionId = page.url.searchParams.get('session_id') || '';
      token = page.url.searchParams.get('token') || '';
      
      if (sessionId && token) {
        // Store token and refresh user data
        document.cookie = `auth_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
        await userStore.init();
        success = true;
      }
      
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Payment Successful - DCA Insights</title>
  <meta name="description" content="Thank you for your payment" />
</svelte:head>

<main class="p-4 md:p-8 max-w-2xl mx-auto">
  {#if loading}
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  {:else if success}
    <div class="text-center py-12">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle class="w-10 h-10 text-green-600" />
      </div>
      
      <h1 class="text-3xl font-bold mb-4">Welcome to DCA Insights Pro!</h1>
      
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Your payment was successful and your account has been upgraded. 
        You now have access to all Pro features including advanced analytics, 
        custom portfolio tracking, and export functionality.
      </p>
      
      <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <h2 class="font-medium mb-4">What's Next:</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-none">1</span>
            <span class="text-sm">Explore your advanced analytics dashboard</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-none">2</span>
            <span class="text-sm">Set up custom portfolio tracking</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-none">3</span>
            <span class="text-sm">Export your analysis reports</span>
          </li>
        </ul>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/sp500-dca-calculator"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Using Pro Features
          <ArrowRight class="w-4 h-4" />
        </a>
        
        <a
          href="/account"
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Manage Subscription
        </a>
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <h1 class="text-2xl font-bold mb-4">Payment Verification Failed</h1>
      <p class="text-gray-600 mb-8">
        We couldn't verify your payment. Please contact support or try again.
      </p>
      
      <a
        href="/pricing"
        class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Pricing
      </a>
    </div>
  {/if}
</main>
