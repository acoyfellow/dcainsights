<script lang="ts">
  import { ExternalLink, Calculator, BookOpen, TrendingUp, Mail, DollarSign, ArrowRight } from 'lucide-svelte';
  
  const links = [
    { 
      title: 'S&P 500 DCA Calculator', 
      url: '/sp500-dca-calculator',
      description: 'Calculate historical DCA returns',
      icon: Calculator,
      color: 'bg-blue-500'
    },
    { 
      title: 'DCA vs Lump Sum', 
      url: '/dca-vs-lump-sum',
      description: 'Compare investment strategies',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    { 
      title: 'DCA Timing Optimizer', 
      url: '/dca-timing-optimizer',
      description: 'Find the best days to invest',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    { 
      title: 'Blog & Guides', 
      url: '/blog',
      description: 'Expert analysis and strategies',
      icon: BookOpen,
      color: 'bg-indigo-500'
    },
    { 
      title: 'Free Newsletter', 
      url: '/newsletter',
      description: 'Weekly market insights',
      icon: Mail,
      color: 'bg-orange-500'
    },
    { 
      title: 'Premium Access', 
      url: '/pricing',
      description: 'Unlock all features',
      icon: DollarSign,
      color: 'bg-pink-500'
    }
  ];
</script>

<svelte:head>
  <title>Links - DCA Insights</title>
  <meta name="description" content="Quick links to DCA calculators, tools, and resources" />
  <meta property="og:title" content="Links - DCA Insights" />
  <meta property="og:description" content="Quick links to DCA calculators and investment tools" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
  <div class="max-w-md mx-auto">
    <!-- Profile -->
    <div class="text-center mb-8 pt-8">
      <img src="/logo.svg" alt="DCA Insights" class="w-24 h-24 mx-auto mb-4" />
      <h1 class="text-2xl font-bold mb-2">DCA Insights</h1>
      <p class="text-gray-600 text-sm">
        Tools & strategies for smarter investing through Dollar Cost Averaging
      </p>
    </div>
    
    <!-- Links -->
    <div class="space-y-4">
      {#each links as link}
        <a
          href={link.url}
          class="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="{link.color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-none">
              <link.icon class="w-6 h-6" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold group-hover:text-blue-600 transition-colors">{link.title}</h3>
              <p class="text-sm text-gray-500 truncate">{link.description}</p>
            </div>
            <ExternalLink class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-none" />
          </div>
        </a>
      {/each}
    </div>
    
    <!-- Social -->
    <div class="mt-8 pt-8 border-t border-gray-200">
      <div class="flex justify-center gap-6">
        <a href="/newsletter" class="text-gray-500 hover:text-blue-600 transition-colors">
          <span class="sr-only">Newsletter</span>
          <Mail class="w-6 h-6" />
        </a>
        <a href="/blog" class="text-gray-500 hover:text-blue-600 transition-colors">
          <span class="sr-only">Blog</span>
          <BookOpen class="w-6 h-6" />
        </a>
        <a href="/pricing" class="text-gray-500 hover:text-blue-600 transition-colors">
          <span class="sr-only">Pricing</span>
          <DollarSign class="w-6 h-6" />
        </a>
      </div>
    </div>
    
    <!-- CTA -->
    <div class="mt-6 text-center">
      <a
        href="/pricing"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        Get Premium Access
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    
    <!-- Footer -->
    <p class="text-center text-xs text-gray-400 mt-8">
      © 2026 DCA Insights. Educational purposes only.
    </p>
  </div>
</main>
