<script lang="ts">
  import { onMount } from 'svelte';
  import { X, Mail, ArrowRight } from 'lucide-svelte';
  
  let visible = $state(false);
  let email = $state('');
  let submitted = $state(false);
  let hasClosed = $state(false);
  
  // Check if already subscribed
  let subscribed = $derived(typeof window !== 'undefined' && localStorage.getItem('dca_newsletter_subscribed') === 'true');
  
  onMount(() => {
    if (subscribed || hasClosed) return;
    
    // Show after 5 seconds
    const timer = setTimeout(() => {
      visible = true;
    }, 5000);
    
    return () => clearTimeout(timer);
  });
  
  function close() {
    visible = false;
    hasClosed = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dca_exit_intent_shown', 'true');
    }
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        submitted = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('dca_newsletter_subscribed', 'true');
        }
        setTimeout(() => {
          close();
        }, 2000);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  }
</script>

{#if visible && !submitted}
  <div class="fixed bottom-4 right-4 z-50 max-w-sm w-full md:w-96 animate-slide-up">
    <div class="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      <button onclick={close} class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600">
        <X class="w-5 h-5" />
      </button>
      
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="font-bold text-lg">Get Weekly DCA Insights</h3>
            <p class="text-sm text-gray-500">Join 5,000+ investors</p>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm mb-4">
          Get market analysis, DCA strategies, and investment tips delivered weekly. 
          No spam, unsubscribe anytime.
        </p>
        
        <form onsubmit={handleSubmit} class="flex gap-2">
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            required
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowRight class="w-5 h-5" />
          </button>
        </form>
        
        <p class="text-xs text-gray-400 mt-3">
          🔒 We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  </div>
{:else if submitted}
  <div class="fixed bottom-4 right-4 z-50 max-w-sm w-full md:w-96 animate-slide-up">
    <div class="bg-green-50 border border-green-200 rounded-xl shadow-lg p-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Mail class="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 class="font-bold text-green-800">You're subscribed!</h3>
          <p class="text-sm text-green-600">Check your inbox for confirmation.</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
</style>
