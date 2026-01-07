<script lang="ts">
  import { onMount } from 'svelte';
  
  // Email signup form state
  let email = $state('');
  let loading = $state(false);
  let success = $state(false);
  let error = $state('');
  let subscribed = $state(false);
  
  onMount(async () => {
    // Check if already subscribed
    try {
      const response = await fetch('/api/newsletter/status');
      if (response.ok) {
        const data = await response.json();
        subscribed = data.subscribed;
      }
    } catch {
      // Ignore errors
    }
  });
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!email) {
      error = 'Please enter your email address';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }
      
      success = true;
      subscribed = true;
    } catch (err) {
      error = 'Failed to subscribe. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Newsletter - DCA Insights</title>
  <meta name="description" content="Get weekly DCA insights and investment strategies delivered to your inbox" />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="text-center mb-12">
    <h1 class="text-3xl font-bold mb-4">DCA Insights Newsletter</h1>
    <p class="text-gray-600 max-w-2xl mx-auto">
      Get weekly analysis, market insights, and DCA strategies delivered straight to your inbox.
      Join over 5,000 investors who stay informed.
    </p>
  </div>
  
  {#if subscribed}
    <div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 class="text-xl font-bold text-green-800 mb-2">You're Subscribed!</h2>
      <p class="text-green-600">
        Check your inbox for a confirmation email. You'll receive your first issue next week.
      </p>
    </div>
  {:else if success}
    <div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <h2 class="text-xl font-bold text-green-800 mb-2">Check Your Inbox!</h2>
      <p class="text-green-600">
        We've sent a confirmation email to {email}. Click the link to verify your subscription.
      </p>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <div class="space-y-6">
        <div class="border border-gray-200 rounded-xl p-6">
          <h3 class="font-bold mb-4">Weekly Market Analysis</h3>
          <p class="text-gray-600 text-sm mb-4">
            Every Monday, receive a comprehensive analysis of how DCA strategies performed 
            over the past week across different market conditions.
          </p>
          <ul class="space-y-2">
            <li class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>S&P 500 DCA performance summary</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Market trend analysis</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Optimal DCA timing insights</span>
            </li>
          </ul>
        </div>
        
        <div class="border border-gray-200 rounded-xl p-6">
          <h3 class="font-bold mb-4">Premium Subscriber Benefits</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-2 text-sm">
              <span class="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-none">P</span>
              <span>Daily market updates (Premium only)</span>
            </li>
            <li class="flex items-start gap-2 text-sm">
              <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-none">+</span>
              <span>Exclusive DCA strategy reports</span>
            </li>
            <li class="flex items-start gap-2 text-sm">
              <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-none">+</span>
              <span>Portfolio optimization tips</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-6 md:p-8">
        <h2 class="text-xl font-bold mb-4">Subscribe Now</h2>
        <p class="text-gray-600 text-sm mb-6">
          Join our mailing list. Unsubscribe anytime.
        </p>
        
        <form onsubmit={handleSubmit} class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              bind:value={email}
              placeholder="you@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          {#if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          {/if}
          
          <button
            type="submit"
            disabled={loading}
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {#if loading}
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Subscribing...
            {:else}
              Subscribe Free
            {/if}
          </button>
          
          <p class="text-xs text-gray-500 text-center">
            We respect your privacy. Read our 
            <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-8 py-8 border-t border-gray-200">
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-600 mb-1">5,000+</div>
        <div class="text-sm text-gray-600">Subscribers</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-600 mb-1">52</div>
        <div class="text-sm text-gray-600">Issues per year</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-600 mb-1">4.8/5</div>
        <div class="text-sm text-gray-600">Reader rating</div>
      </div>
    </div>
  {/if}
</main>
