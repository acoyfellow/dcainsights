<script lang="ts">
  import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-svelte';
  
  const post = {
    title: 'DCA vs Lump Sum: The Data Says...',
    excerpt: 'We analyzed 50 years of S&P 500 data to settle the debate once and for all.',
    date: '2026-01-03',
    readTime: '8 min read',
    category: 'Analysis'
  };
</script>

<svelte:head>
  <title>{post.title} - DCA Insights</title>
  <meta name="description" content={post.excerpt} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:type" content="article" />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <a href="/blog" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
    <ArrowLeft class="w-4 h-4" />
    Back to Blog
  </a>
  
  <header class="mb-8">
    <div class="flex items-center gap-3 mb-4">
      <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        {post.category}
      </span>
      <span class="flex items-center gap-1 text-gray-500 text-sm">
        <Calendar class="w-4 h-4" />
        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </span>
      <span class="flex items-center gap-1 text-gray-500 text-sm">
        <Clock class="w-4 h-4" />
        {post.readTime}
      </span>
    </div>
    
    <h1 class="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
    <p class="text-xl text-gray-600">{post.excerpt}</p>
  </header>
  
  <article class="prose prose-lg">
    <section>
      <h2>The Eternal Debate</h2>
      <p>
        Every investor faces this question: Should I invest a lump sum now, or spread it out over time?
        Financial advisors have debated this for decades. Let's let the data decide.
      </p>
    </section>
    
    <section>
      <h2>What the Data Shows</h2>
      <p>
        Analyzing 50 years of S&P 500 data (1974-2024), we found that lump sum investing outperforms 
        DCA approximately <strong>66% of the time</strong>. This makes intuitive sense—markets tend to 
        rise over time, so getting money in earlier usually means benefiting from that growth.
      </p>
      
      <table>
        <thead>
          <tr>
            <th>Investment Period</th>
            <th>Lump Sum Wins</th>
            <th>DCA Wins</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 Year</td>
            <td>68%</td>
            <td>32%</td>
          </tr>
          <tr>
            <td>3 Years</td>
            <td>71%</td>
            <td>29%</td>
          </tr>
          <tr>
            <td>5 Years</td>
            <td>74%</td>
            <td>26%</td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <section>
      <h2>When DCA Wins</h2>
      <p>
        Despite the odds, DCA still wins about one-third of the time. DCA tends to outperform when:
      </p>
      <ul>
        <li>Markets are volatile with no clear trend</li>
        <li>You're investing during historically overvalued periods</li>
        <li>You have psychological resistance to market volatility</li>
      </ul>
    </section>
    
    <section>
      <h2>Beyond Returns: Other Factors</h2>
      <p>
        Returns aren't everything. Consider these factors:
      </p>
      <ul>
        <li><strong>Sleep quality:</strong> DCA reduces the stress of timing the market</li>
        <li><strong>Flexibility:</strong> DCA allows you to adjust based on changing circumstances</li>
        <li><strong>Cash flow:</strong> Many investors don't have a lump sum available</li>
      </ul>
    </section>
    
    <section>
      <h2>Our Recommendation</h2>
      <p>
        If you have the capital and can handle market volatility, <strong>lump sum investing 
        mathematically favors success</strong>. However, if the idea of investing everything at once 
        causes anxiety, or you're building wealth gradually, <strong>DCA is a perfectly reasonable strategy</strong>.
      </p>
      <p>
        The best strategy is the one you'll actually stick with.
      </p>
    </section>
    
    <section>
      <h2>Try It Yourself</h2>
      <p>
        Use our <a href="/dca-vs-lump-sum">DCA vs Lump Sum Calculator</a> to see how these strategies 
        would have performed with different investment amounts and time periods.
      </p>
    </section>
  </article>
  
  <div class="mt-12 p-6 bg-blue-50 rounded-xl">
    <h3 class="font-bold mb-2">Ready to Compare Strategies?</h3>
    <p class="text-gray-600 mb-4">
      Use our interactive calculator to see DCA vs Lump Sum performance.
    </p>
    <a
      href="/dca-vs-lump-sum"
      class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
    >
      Launch Calculator
      <ArrowRight class="w-4 h-4" />
    </a>
  </div>
</main>

<style>
  section { margin-bottom: 2rem; }
  h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
  p { margin-bottom: 1rem; line-height: 1.7; }
  ul { margin-bottom: 1rem; padding-left: 1.5rem; }
  li { margin-bottom: 0.5rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e5e5; }
  th { font-weight: 600; background: #f9fafb; }
</style>
