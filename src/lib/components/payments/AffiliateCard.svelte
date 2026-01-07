<script lang="ts">
  import { ExternalLink, Copy, Check, DollarSign, TrendingUp } from 'lucide-svelte';
  import type { AffiliatePartner } from '$lib/server/affiliate';
  
  let { 
    partner,
    affiliateLink 
  }: { 
    partner: AffiliatePartner;
    affiliateLink: string;
  } = $props();
  
  let copied = $state(false);
  
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
  
  function formatCommission(percent: number): string {
    return `${percent}%`;
  }
</script>

<div class="border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors">
  <div class="flex items-start justify-between mb-4">
    <div>
      <h3 class="font-bold text-lg mb-1">{partner.name}</h3>
      <p class="text-gray-600 text-sm">{partner.description}</p>
    </div>
    
    <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
      <DollarSign class="w-3 h-3" />
      {formatCommission(partner.commission)} commission
    </span>
  </div>
  
  <div class="flex items-center gap-2 mb-4">
    <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
      {partner.category}
    </span>
    
    <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
      <TrendingUp class="w-3 h-3 inline mr-1" />
      High conversion
    </span>
  </div>
  
  <div class="flex gap-2">
    <a
      href={affiliateLink}
      target="_blank"
      rel="noopener noreferrer"
      class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Visit Partner
      <ExternalLink class="w-4 h-4" />
    </a>
    
    <button
      onclick={copyLink}
      class="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
    >
      {#if copied}
        <Check class="w-5 h-5 text-green-600" />
      {:else}
        <Copy class="w-5 h-5 text-gray-500" />
      {/if}
    </button>
  </div>
  
  <p class="text-xs text-gray-500 mt-3">
    Disclosures: This link contains an affiliate referral. We may receive a commission at no extra cost to you.
  </p>
</div>
