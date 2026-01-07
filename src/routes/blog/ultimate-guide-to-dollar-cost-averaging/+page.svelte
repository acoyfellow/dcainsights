<script lang="ts">
  import { Calendar, Clock, Share2, ArrowLeft, ArrowRight } from 'lucide-svelte';
  import { page } from '$app/state';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  const post = {
    title: 'The Ultimate Guide to Dollar Cost Averaging in 2026',
    excerpt: 'Learn how DCA works, why it beats timing the market, and how to implement it for long-term wealth building.',
    date: '2026-01-05',
    readTime: '12 min read',
    category: 'Strategy',
    author: 'DCA Insights Team'
  };
  
  // Table of contents
  const toc = [
    { id: 'what-is-dca', title: 'What is Dollar Cost Averaging?' },
    { id: 'how-it-works', title: 'How DCA Works' },
    { id: 'why-it-works', title: 'Why DCA Works' },
    { id: 'dca-vs-lump-sum', title: 'DCA vs Lump Sum Investing' },
    { id: 'historical-returns', title: 'Historical Returns Analysis' },
    { id: 'implementation', title: 'Implementing DCA' },
    { id: 'common-mistakes', title: 'Common Mistakes to Avoid' },
    { id: 'advanced-strategies', title: 'Advanced Strategies' },
    { id: 'faq', title: 'Frequently Asked Questions' }
  ];
</script>

<svelte:head>
  <title>{post.title} - DCA Insights</title>
  <meta name="description" content={post.excerpt} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <!-- Back Link -->
  <a href="/blog" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
    <ArrowLeft class="w-4 h-4" />
    Back to Blog
  </a>
  
  <!-- Article Header -->
  <header class="mb-12">
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
    
    <h1 class="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
    
    <p class="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
    
    <div class="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
      <span class="text-sm text-gray-500">By {post.author}</span>
      <div class="flex-1"></div>
      <ShareButtons title={post.title} description={post.excerpt} />
    </div>
  </header>
  
  <!-- Table of Contents -->
  <nav class="bg-gray-50 rounded-xl p-6 mb-12">
    <h2 class="font-bold mb-4">Table of Contents</h2>
    <ul class="space-y-2">
      {#each toc as item}
        <li>
          <a href="#{item.id}" class="text-gray-600 hover:text-blue-600 transition-colors block py-1">
            {item.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
  
  <!-- Article Content -->
  <article class="prose prose-lg max-w-none">
    <section id="what-is-dca">
      <h2>What is Dollar Cost Averaging?</h2>
      <p>
        Dollar Cost Averaging (DCA) is an investment strategy where you invest a fixed amount 
        of money at regular intervals, regardless of the asset's price. Instead of trying to 
        time the market, you invest consistently over time.
      </p>
      <p>
        For example, instead of investing $12,000 at once, you might invest $1,000 per month 
        for 12 months. When prices are high, your $1,000 buys fewer shares. When prices are 
        low, it buys more shares.
      </p>
    </section>
    
    <section id="how-it-works">
      <h2>How DCA Works</h2>
      <p>
        The magic of DCA lies in its simplicity and the mathematical effect of buying more 
        shares when prices fall and fewer when prices rise.
      </p>
      <h3>Example: DCA in Action</h3>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Price</th>
            <th>Investment</th>
            <th>Shares Bought</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>January</td>
            <td>$100</td>
            <td>$500</td>
            <td>5.00</td>
          </tr>
          <tr>
            <td>February</td>
            <td>$80</td>
            <td>$500</td>
            <td>6.25</td>
          </tr>
          <tr>
            <td>March</td>
            <td>$120</td>
            <td>$500</td>
            <td>4.17</td>
          </tr>
          <tr>
            <td>April</td>
            <td>$90</td>
            <td>$500</td>
            <td>5.56</td>
          </tr>
        </tbody>
      </table>
      <p>
        Despite price volatility, your <strong>average cost per share</strong> is <strong>$94.87</strong>, 
        lower than the average price of $97.50.
      </p>
    </section>
    
    <section id="why-it-works">
      <h2>Why DCA Works</h2>
      <p>
        DCA works for several interconnected reasons:
      </p>
      <ul>
        <li><strong>Removes emotion:</strong> No trying to predict market tops and bottoms</li>
        <li><strong>Average purchase price:</strong> Naturally lowers your cost basis over time</li>
        <li><strong>Discipline:</strong> Creates a regular investing habit</li>
        <li><strong>Cash flow matching:</strong> Invest as you earn, not when you have a lump sum</li>
      </ul>
    </section>
    
    <section id="dca-vs-lump-sum">
      <h2>DCA vs Lump Sum Investing</h2>
      <p>
        Historically, lump sum investing outperforms DCA about 66% of the time because markets 
        tend to rise over time. However, DCA has advantages:
      </p>
      <ul>
        <li>Lower risk if markets decline after investing</li>
        <li>Easier to implement with regular income</li>
        <li>Psychological comfort for new investors</li>
        <li>No large capital requirement upfront</li>
      </ul>
      <p>
        <a href="/dca-vs-lump-sum">Try our DCA vs Lump Sum Calculator</a> to see how they compare 
        with historical S&P 500 data.
      </p>
    </section>
    
    <section id="historical-returns">
      <h2>Historical Returns Analysis</h2>
      <p>
        Using 50+ years of S&P 500 data, we can analyze DCA performance across different market conditions:
      </p>
      <h3>Key Findings</h3>
      <ul>
        <li><strong>Bull markets:</strong> DCA still builds wealth, just at a slower pace than lump sum</li>
        <li><strong>Bear markets:</strong> DCA shines, allowing accumulation at discounted prices</li>
        <li><strong>Flat markets:</strong> DCA generates returns through dividend reinvestment</li>
        <li><strong>Volatile markets:</strong> DCA captures volatility through share accumulation</li>
      </ul>
    </section>
    
    <section id="implementation">
      <h2>Implementing DCA</h2>
      <h3>Step 1: Choose Your Investment Amount</h3>
      <p>
        A good starting point is investing 10-20% of your income. Use our 
        <a href="/sp500-dca-calculator">DCA Calculator</a> to see how different amounts grow over time.
      </p>
      
      <h3>Step 2: Set Your Interval</h3>
      <p>
        Most investors choose monthly contributions, but weekly or bi-weekly also works well. 
        The key is consistency.
      </p>
      
      <h3>Step 3: Automate</h3>
      <p>
        Set up automatic transfers from your checking account to your investment account. 
        The less friction, the more consistent you'll be.
      </p>
    </section>
    
    <section id="common-mistakes">
      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li><strong>Stopping during downturns:</strong> This defeats the purpose of DCA</li>
        <li><strong>Waiting for the "right time":</strong> There is no right time</li>
        <li><strong>Too frequent checking:</strong> Daily price watching leads to emotional decisions</li>
        <li><strong>Neglecting other investments:</strong> DCA is one tool, not a complete strategy</li>
      </ul>
    </section>
    
    <section id="advanced-strategies">
      <h2>Advanced Strategies</h2>
      <h3>Value-Avggeraging</h3>
      <p>
        Increase your contribution when prices fall and decrease when prices rise, targeting 
        a specific growth rate.
      </p>
      
      <h3>DCA with Reinvestment</h3>
      <p>
        Automatically reinvest dividends and capital gains to compound your returns.
      </p>
      
      <h3>Tax-Loss Harvesting with DCA</h3>
      <p>
        Combine DCA with tax-loss harvesting to optimize after-tax returns.
      </p>
    </section>
    
    <section id="faq">
      <h2>Frequently Asked Questions</h2>
      
      <h3>How much do I need to start DCA?</h3>
      <p>
        You can start with as little as $50/month through many brokerage platforms that offer 
        fractional shares.
      </p>
      
      <h3>What's the best interval for DCA?</h3>
      <p>
        Monthly is most common and practical. Research shows minimal difference between 
        weekly, monthly, and quarterly DCA.
      </p>
      
      <h3>Does DCA guarantee profits?</h3>
      <p>
        No investment strategy guarantees profits. DCA reduces risk but doesn't eliminate it. 
        Past performance doesn't guarantee future results.
      </p>
      
      <h3>Should I DCA into individual stocks?</h3>
      <p>
        DCA is often better suited for diversified investments like index funds. DCA into 
        single stocks concentrates risk.
      </p>
    </section>
  </article>
  
  <!-- CTA -->
  <div class="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
    <h3 class="text-xl font-bold mb-4">Ready to Start DCA?</h3>
    <p class="text-gray-600 mb-4">
      Try our free DCA calculator to see how this strategy could work for your investment goals.
    </p>
    <a
      href="/sp500-dca-calculator"
      class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Launch Calculator
      <ArrowRight class="w-4 h-4" />
    </a>
  </div>
  
  <!-- Share -->
  <div class="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
    <span class="text-gray-500">Share this article:</span>
    <ShareButtons title={post.title} description={post.excerpt} />
  </div>
</main>

<style>
  section {
    margin-bottom: 2.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #333;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.75;
    color: #4a4a4a;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
  }
  
  th {
    font-weight: 600;
    background: #f9fafb;
  }
  
  a {
    color: #2563eb;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>
