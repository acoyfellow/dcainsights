<script lang="ts">
  import { Calculator, TrendingUp, BookOpen, Shield, ArrowRight, CheckCircle } from 'lucide-svelte';
  
  const stats = [
    { value: '50+', label: 'Years of Data' },
    { value: '12%', label: 'Avg Annual Return' },
    { value: '5,000+', label: 'Monthly Users' },
    { value: '4.8/5', label: 'User Rating' }
  ];
  
  const tools = [
    { title: 'S&P 500 DCA Calculator', desc: 'Historical performance analysis', url: '/sp500-dca-calculator', icon: Calculator },
    { title: 'DCA vs Lump Sum', desc: 'Strategy comparison', url: '/dca-vs-lump-sum', icon: TrendingUp },
    { title: 'DCA Timing Optimizer', desc: 'Find optimal investment days', url: '/dca-timing-optimizer', icon: BookOpen },
    { title: 'Bear Market Analysis', desc: 'Survival strategies', url: '/bear-market-dca', icon: Shield }
  ];
</script>

<svelte:head>
  <title>About - DCA Insights | Dollar Cost Averaging Education</title>
  <meta name="description" content="Learn about DCA Insights - our mission to educate investors on Dollar Cost Averaging strategies using 50+ years of historical data." />
  <meta property="og:title" content="About - DCA Insights" />
  <meta property="og:description" content="Our mission: making investment education accessible through data-driven DCA analysis." />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://dcainsights.com/about" />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <!-- Hero -->
  <div class="text-center mb-16">
    <h1 class="text-3xl md:text-5xl font-bold mb-6">Democratizing Investment Education</h1>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
      We're building the most comprehensive resource for understanding Dollar Cost Averaging 
      through data-driven analysis and accessible tools.
    </p>
  </div>
  
  <!-- Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
    {#each stats as stat}
      <div class="text-center p-6 bg-gray-50 rounded-xl">
        <div class="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
        <div class="text-sm text-gray-600">{stat.label}</div>
      </div>
    {/each}
  </div>
  
  <!-- Mission -->
  <div class="grid md:grid-cols-2 gap-12 mb-16">
    <div>
      <h2 class="text-2xl font-bold mb-4">Our Mission</h2>
     text-gray-600 <p class=" mb-4">
        Investment education has traditionally been gatekept behind expensive courses and 
        financial advisors. We believe everyone deserves access to the data and tools needed 
        to make informed investment decisions.
      </p>
      <p class="text-gray-600 mb-4">
        DCA Insights was born from a simple question: What if we could show people exactly 
        how Dollar Cost Averaging has performed over decades of market cycles?
      </p>
      <p class="text-gray-600">
        Today, we analyze 50+ years of S&P 500 data to help investors understand the 
        power of systematic, disciplined investing.
      </p>
    </div>
    
    <div>
      <h2 class="text-2xl font-bold mb-4">What We Offer</h2>
      <ul class="space-y-4">
        {#each tools as tool}
          <li>
            <a href={tool.url} class="flex items-start gap-3 group">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-none group-hover:bg-blue-200 transition-colors">
                <tool.icon class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 class="font-medium group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                <p class="text-sm text-gray-500">{tool.desc}</p>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  
  <!-- Values -->
  <div class="bg-gray-50 rounded-2xl p-8 mb-16">
    <h2 class="text-2xl font-bold mb-6 text-center">Our Values</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield class="w-8 h-8 text-blue-600" />
        </div>
        <h3 class="font-bold mb-2">Education First</h3>
        <p class="text-sm text-gray-600">
          We prioritize teaching over selling. Our tools explain the "why" behind every calculation.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="font-bold mb-2">Data-Driven</h3>
        <p class="text-sm text-gray-600">
          Every claim is backed by historical data. No hype, just facts from 50+ years of markets.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen class="w-8 h-8 text-purple-600" />
        </div>
        <h3 class="font-bold mb-2">Accessible</h3>
        <p class="text-sm text-gray-600">
          Free tools for everyone. Premium features for those who want to go deeper.
        </p>
      </div>
    </div>
  </div>
  
  <!-- CTA -->
  <div class="text-center">
    <h2 class="text-2xl font-bold mb-4">Ready to Learn?</h2>
    <p class="text-gray-600 mb-6">
      Start exploring DCA strategies with our free calculators and guides.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/sp500-dca-calculator"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Try the Calculator
        <ArrowRight class="w-4 h-4" />
      </a>
      <a
        href="/blog"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        Read Our Blog
      </a>
    </div>
  </div>
</main>
