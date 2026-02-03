<script lang="ts">
  import { Calendar, Clock, ArrowRight, Search } from 'lucide-svelte';
  
  const posts = [
    {
      slug: 'how-much-to-invest-monthly-dca-guide',
      title: 'How Much Should You Invest Monthly? The Complete DCA Amount Guide',
      excerpt: 'A data-driven guide to determining your optimal monthly investment amount for dollar cost averaging. Includes calculators, examples, and strategies for every income level.',
      date: '2026-02-03',
      readTime: '12 min read',
      category: 'Guide',
      featured: true,
      image: '/og.png'
    },
    {
      slug: 'best-sp500-index-funds-for-dca',
      title: 'Best S&P 500 Index Funds for DCA in 2026: VOO vs SPY vs IVV',
      excerpt: 'Compare the top low-cost S&P 500 index funds for dollar cost averaging. Detailed analysis of expense ratios, tracking error, and which fund is best for your DCA strategy.',
      date: '2026-02-03',
      readTime: '12 min read',
      category: 'Index Funds',
      featured: true,
      image: '/og.png'
    },
    {
      slug: 'how-to-build-retirement-wealth-with-dca',
      title: 'How to Build Retirement Wealth with Dollar Cost Averaging',
      excerpt: 'A comprehensive guide to using DCA in your 401(k), IRA, and brokerage accounts to build lasting retirement wealth.',
      date: '2026-02-03',
      readTime: '15 min read',
      category: 'Retirement',
      featured: true,
      image: '/og.png'
    },
    {
      slug: 'ultimate-guide-to-dollar-cost-averaging',
      title: 'The Ultimate Guide to Dollar Cost Averaging in 2026',
      excerpt: 'Learn how DCA works, why it beats timing the market, and how to implement it for long-term wealth building.',
      date: '2026-01-05',
      readTime: '12 min read',
      category: 'Strategy',
      featured: false,
      image: '/og.png'
    },
    {
      slug: 'dca-vs-lump-sum-which-wins',
      title: 'DCA vs Lump Sum: The Data Says...',
      excerpt: 'We analyzed 50 years of S&P 500 data to settle the debate once and for all.',
      date: '2026-01-03',
      readTime: '8 min read',
      category: 'Analysis',
      featured: false,
      image: '/og.png'
    },
    {
      slug: 'bear-market-survival-guide',
      title: 'Bear Market Survival Guide: Keep Buying',
      excerpt: 'Historical data shows the best strategy during market crashes is counterintuitive.',
      date: '2026-01-01',
      readTime: '10 min read',
      category: 'Strategy',
      featured: false,
      image: '/og.png'
    },
    {
      slug: 'best-days-to-invest',
      title: 'Best Days to Invest: Does Timing Matter?',
      excerpt: 'Analyzing 10 years of data to find optimal DCA timing patterns.',
      date: '2025-12-28',
      readTime: '6 min read',
      category: 'Analysis',
      featured: false,
      image: '/og.png'
    },
    {
      slug: 'dca-crypto-vs-stocks',
      title: 'DCA Crypto vs DCA Stocks: Which Returns More?',
      excerpt: 'Comparing dollar cost averaging strategies across asset classes.',
      date: '2025-12-25',
      readTime: '9 min read',
      category: 'Comparison',
      featured: false,
      image: '/og.png'
    },
    {
      slug: 'tax-advantages-of-dca',
      title: 'Hidden Tax Advantages of Systematic Investing',
      excerpt: 'How DCA can optimize your tax situation over time.',
      date: '2025-12-20',
      readTime: '7 min read',
      category: 'Tax',
      featured: false,
      image: '/og.png'
    }
  ];
  
  const categories = ['All', 'Strategy', 'Retirement', 'Analysis', 'Comparison', 'Tax', 'News'];
  let selectedCategory = $state('All');
  let searchQuery = $state('');
  
  let filteredPosts = $derived.by(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  });
</script>

<svelte:head>
  <title>Blog - DCA Insights | Investment Strategies & Analysis</title>
  <meta name="description" content="Expert analysis and guides on Dollar Cost Averaging strategies, market analysis, and investment insights." />
  <meta property="og:title" content="Blog - DCA Insights" />
  <meta property="og:description" content="Expert analysis and guides on Dollar Cost Averaging strategies." />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://dcainsights.com/blog" />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "DCA Insights Blog",
      "description": "Expert analysis and guides on Dollar Cost Averaging strategies",
      "url": "https://dcainsights.com/blog"
    }
  </script>
</svelte:head>

<main class="p-4 md:p-8 max-w-6xl mx-auto">
  <div class="text-center mb-12">
    <h1 class="text-3xl md:text-4xl font-bold mb-4">DCA Insights Blog</h1>
    <p class="text-gray-600 max-w-2xl mx-auto">
      Expert analysis, strategies, and insights on Dollar Cost Averaging and systematic investing.
    </p>
  </div>
  
  <!-- Search & Filter -->
  <div class="flex flex-col sm:flex-row gap-4 mb-8">
    <div class="relative flex-1">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search articles..."
        class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div class="flex gap-2 overflow-x-auto pb-2">
      {#each categories as category}
        <button
          onclick={() => selectedCategory = category}
          class="px-4 py-2 rounded-lg whitespace-nowrap transition-colors {
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }"
        >
          {category}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Featured Post -->
  {#if selectedCategory === 'All' && !searchQuery}
    {@const featured = posts.find(p => p.featured)}
    {#if featured}
      <a href="/blog/{featured.slug}" class="block mb-12 group">
        <article class="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
          <div class="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="text-white text-6xl font-bold opacity-20">DCA</span>
          </div>
          <div class="p-6 md:p-8">
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {featured.category}
              </span>
              <span class="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar class="w-4 h-4" />
                {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
              {featured.title}
            </h2>
            <p class="text-gray-600 mb-4">{featured.excerpt}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <Clock class="w-4 h-4" />
                {featured.readTime}
              </span>
              <span class="flex items-center gap-1 text-blue-600 font-medium">
                Read more
                <ArrowRight class="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </a>
    {/if}
  {/if}
  
  <!-- Posts Grid -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredPosts.filter(p => !p.featured) as post}
      <a href="/blog/{post.slug}" class="group">
        <article class="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors h-full flex flex-col">
          <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span class="text-gray-400 text-4xl font-bold opacity-30">DCA</span>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>
            <h3 class="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
              <span class="flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </article>
      </a>
    {/each}
  </div>
  
  {#if filteredPosts.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500">No articles found matching your criteria.</p>
    </div>
  {/if}
  
  <!-- Newsletter CTA -->
  <div class="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-center">
    <h3 class="text-xl font-bold mb-2">Never Miss an Update</h3>
    <p class="text-gray-600 mb-4">Get the latest DCA strategies and market analysis delivered to your inbox.</p>
    <a href="/newsletter" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
      Subscribe to Newsletter
    </a>
  </div>
</main>
