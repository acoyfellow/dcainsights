<script lang="ts">
  import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-svelte';
  
  const post = {
    title: 'Bear Market Survival Guide: Keep Buying',
    excerpt: 'Historical data shows the best strategy during market crashes is counterintuitive.',
    date: '2026-01-01',
    readTime: '10 min read',
    category: 'Strategy'
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
      <h2>The Paradox of Bear Markets</h2>
      <p>
        When markets crash, every instinct tells you to sell or stop buying. But historical data 
        tells a different story. The best time to buy is when everyone else is selling.
      </p>
    </section>
    
    <section>
      <h2>What History Tells Us</h2>
      <p>Let's look at how DCA performed during major bear markets:</p>
      
      <table>
        <thead>
          <tr>
            <th>Bear Market</th>
            <th>Peak to Trough</th>
            <th>DCA Recovery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2000-2002 (Dot-com)</td>
            <td>-49%</td>
            <td>2.3 years</td>
          </tr>
          <tr>
            <td>2007-2009 (Financial)</td>
            <td>-57%</td>
            <td>1.8 years</td>
          </tr>
          <tr>
            <td>2020 (COVID)</td>
            <td>-34%</td>
            <td>4 months</td>
          </tr>
          <tr>
            <td>2022 (Tech)</td>
            <td>-25%</td>
            <td>In progress</td>
          </tr>
        </tbody>
      </table>
      
      <p>
        <strong>Key insight:</strong> In every case, investors who kept buying during the crash 
        recovered faster and ultimately achieved better returns.
      </p>
    </section>
    
    <section>
      <h2>Why DCA Works in Crashes</h2>
      <ul>
        <li><strong>Lower average cost:</strong> Buying at lower prices reduces your cost basis</li>
        <li><strong>More shares:</strong> Your fixed investment buys more shares when prices drop</li>
        <li><strong>Automatic discipline:</strong> You can't time the bottom, so you catch it automatically</li>
        <li><strong>Emotional buffer:</strong> The system removes fear from the equation</li>
      </ul>
    </section>
    
    <section>
      <h2>Practical Tips for Bear Markets</h2>
      <ul>
        <li>Automate your investments so you don't have to make decisions emotionally</li>
        <li>Increase contributions if possible—prices are on sale</li>
        <li>Avoid checking your portfolio too frequently</li>
        <li>Remember: this is temporary, markets have always recovered</li>
      </ul>
    </section>
    
    <section>
      <h2>The Bottom Line</h2>
      <p>
        Bear markets are terrifying, but they're also the best opportunity for long-term investors. 
        Using DCA during a bear market is like getting a permanent discount on everything you buy.
      </p>
    </section>
  </article>
  
  <div class="mt-12 p-6 bg-green-50 rounded-xl">
    <h3 class="font-bold mb-2">See Bear Market Performance</h3>
    <p class="text-gray-600 mb-4">
      Use our Bear Market DCA Analysis tool to see how DCA performed during historical crashes.
    </p>
    <a
      href="/bear-market-dca"
      class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
    >
      View Analysis
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
