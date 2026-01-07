<script lang="ts">
  import { page } from '$app/state';
  import { Mail, ArrowRight, Loader2 } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  
  let email = $state('');
  let name = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state(false);
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!email) {
      error = 'Please enter your email address';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      
      // Store token
      document.cookie = `auth_token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;
      
      success = true;
      
      // Redirect after brief delay
      setTimeout(() => {
        const redirect = page.url.searchParams.get('redirect') || '/';
        goto(redirect);
      }, 1500);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign In - DCA Insights</title>
  <meta name="description" content="Sign in to your DCA Insights account" />
</svelte:head>

<main class="p-4 md:p-8 max-w-md mx-auto">
  <div class="text-center mb-8">
    <h1 class="text-2xl font-bold mb-2">Welcome Back</h1>
    <p class="text-gray-600">
      Sign in to access your DCA calculations and premium features
    </p>
  </div>
  
  {#if success}
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
        <Mail class="w-6 h-6 text-green-600" />
      </div>
      
      <h2 class="text-lg font-medium text-green-800 mb-2">Check your email!</h2>
      <p class="text-green-600">
        We've sent you a magic link. Check your inbox to complete sign in.
      </p>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-6">
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700">
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
      
      <div class="space-y-2">
        <label for="name" class="block text-sm font-medium text-gray-700">
          Name (optional)
        </label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Your name"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <Loader2 class="w-5 h-5 animate-spin" />
          Creating account...
        {:else}
          Continue with Email
          <ArrowRight class="w-5 h-5" />
        {/if}
      </button>
      
      <p class="text-sm text-gray-500 text-center">
        By continuing, you agree to our 
        <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
        and 
        <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>
      </p>
    </form>
  {/if}
  
  <div class="mt-8 pt-8 border-t border-gray-200">
    <p class="text-center text-gray-600">
      Already have an account? 
      <a href="/auth/login" class="text-blue-600 hover:underline">Sign in</a>
    </p>
  </div>
</main>
