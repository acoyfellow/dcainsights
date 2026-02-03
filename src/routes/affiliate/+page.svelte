<script lang="ts">
  import { userStore } from '$lib/stores/user';
  import type { AffiliatePartner } from '$lib/types';
  import AffiliateCard from '$lib/components/payments/AffiliateCard.svelte';
  import { DollarSign, TrendingUp } from 'lucide-svelte';

  let { data } = $props<{ data: { partners: AffiliatePartner[] } }>();
  let userId = $state<string>('');
  let loading = $state(true);

  $effect(() => {
    userStore.init();
    const unsubscribe = userStore.subscribe(state => {
      if (state.initialized && !state.loading) {
        userId = state.user?.userId || '';
        loading = false;
      }
    });
    return unsubscribe;
  });

  function getLink(partnerId: string): string {
    const partner = data.partners.find((p: AffiliatePartner) => p.id === partnerId);
    if (!partner) return '';

    const baseUrl = partner.url;
    const affiliateCode = `dcainsights-${userId || 'ref'}`;
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}ref=${affiliateCode}&source=affiliate-page`;
  }
</script>

<svelte:head>
  <title>Affiliate Partners - DCA Insights</title>
  <meta name="description" content="Partner with top brokerage platforms and investment tools" />
</svelte:head>

<main class="p-4 md:p-8 max-w-6xl mx-auto">
  <div class="text-center mb-12">
    <h1 class="text-3xl font-bold mb-4">Partner with Top Investment Platforms</h1>
    <p class="text-gray-600 max-w-2xl mx-auto">
      We've partnered with leading brokerages and financial tools to help you take the next step in your investment journey.
      Use our exclusive links to sign up and support DCA Insights at no extra cost to you.
    </p>
  </div>

  {#if loading}
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 gap-6 mb-12">
      <div class="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 class="font-bold">Earn Commission</h3>
            <p class="text-sm text-gray-600">Up to 5% on referrals</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Share your unique links and earn commission when friends sign up through your referrals.
        </p>
      </div>

      <div class="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 class="font-bold">Support DCA Insights</h3>
            <p class="text-sm text-gray-600">Help us grow</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Your referrals help us continue providing free educational tools and analysis.
        </p>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-bold mb-6">Featured Partners</h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.partners as partner}
          <AffiliateCard
            {partner}
            affiliateLink={getLink(partner.id)}
          />
        {/each}
      </div>
    </div>

    <div class="border-t border-gray-200 pt-8">
      <h2 class="text-xl font-bold mb-4">How It Works</h2>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-xl font-bold text-blue-600">1</span>
          </div>
          <h3 class="font-bold mb-2">Choose a Partner</h3>
          <p class="text-gray-600 text-sm">
            Select from our verified partners that match your investment style
          </p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-xl font-bold text-blue-600">2</span>
          </div>
          <h3 class="font-bold mb-2">Share Your Link</h3>
          <p class="text-gray-600 text-sm">
            Use your unique referral link to share with friends and followers
          </p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-xl font-bold text-blue-600">3</span>
          </div>
          <h3 class="font-bold mb-2">Earn Rewards</h3>
          <p class="text-gray-600 text-sm">
            Receive commission when they sign up and make their first trade
          </p>
        </div>
      </div>
    </div>
  {/if}
</main>
