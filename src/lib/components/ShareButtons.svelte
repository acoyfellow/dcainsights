<script lang="ts">
  import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-svelte';
  
  let { 
    title = 'DCA Insights',
    description = 'Tools to analyze and understand Dollar Cost Averaging (DCA) investment strategies',
    url = '',
    showShare = $bindable(true)
  } = $props();
  
  let copied = $state(false);
  
  const shareUrl = $derived(url || (typeof window !== 'undefined' ? window.location.href : ''));
  const shareText = $derived(`Check out ${title}: ${description}`);
  
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
  
  function shareOnTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  }
  
  function shareOnLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  }
</script>

{#if showShare}
  <div class="flex items-center gap-2">
    <button
      onclick={shareOnTwitter}
      class="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
      title="Share on Twitter"
    >
      <Twitter class="w-5 h-5" />
    </button>
    
    <button
      onclick={shareOnLinkedIn}
      class="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      title="Share on LinkedIn"
    >
      <Linkedin class="w-5 h-5" />
    </button>
    
    <button
      onclick={copyLink}
      class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      title="Copy link"
    >
      {#if copied}
        <Check class="w-5 h-5 text-green-500" />
      {:else}
        <LinkIcon class="w-5 h-5" />
      {/if}
    </button>
  </div>
{/if}
