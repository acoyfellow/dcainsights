<script lang="ts">
  import {
    TrendingUp,
    Calculator,
    BarChart3,
    Calendar,
    BookOpen,
    ArrowRight,
    ChevronRight,
    Play,
    FileText,
    Clock,
    Mail,
    Twitter,
    Github,
    Lock,
    CheckCircle
  } from "lucide-svelte";
  import { page } from "$app/state";

  // Featured blog posts
  const featuredPosts = [
    {
      slug: "ultimate-guide-to-dollar-cost-averaging",
      title: "The Ultimate Guide to Dollar Cost Averaging in 2026",
      excerpt: "Learn how DCA works, why it beats timing the market, and how to implement it for long-term wealth building.",
      date: "2026-01-05",
      readTime: "12 min read",
      category: "Strategy"
    },
    {
      slug: "dca-vs-lump-sum-which-wins",
      title: "DCA vs Lump Sum: The Data Says...",
      excerpt: "We analyzed 50 years of S&P 500 data to settle the debate once and for all.",
      date: "2026-01-03",
      readTime: "8 min read",
      category: "Analysis"
    },
    {
      slug: "bear-market-survival-guide",
      title: "Bear Market Survival Guide: Keep Buying",
      excerpt: "Historical data shows the best strategy during market crashes is counterintuitive.",
      date: "2026-01-01",
      readTime: "10 min read",
      category: "Strategy"
    }
  ];

  // Tools data
  const tools = [
    {
      href: "/sp500-dca-calculator",
      icon: Calculator,
      title: "S&P 500 DCA Calculator",
      description: "Calculate how Dollar Cost Averaging into the S&P 500 would have performed historically.",
      color: "blue"
    },
    {
      href: "/dca-vs-lump-sum",
      icon: TrendingUp,
      title: "DCA vs Lump Sum",
      description: "Compare Dollar Cost Averaging against lump sum investing using historical S&P 500 data.",
      color: "green"
    },
    {
      href: "/dca-timing-optimizer",
      icon: Calendar,
      title: "DCA Timing Optimizer",
      description: "Statistical analysis of optimal investment timing. Discover which days historically perform best.",
      color: "purple"
    },
    {
      href: "/bear-market-dca",
      icon: BarChart3,
      title: "Bear Market Analysis",
      description: "Study how DCA strategies performed during major S&P 500 bear markets and crashes.",
      color: "red"
    },
    {
      href: "/recession-dca",
      icon: BookOpen,
      title: "Recession Analysis",
      description: "Academic analysis of Dollar Cost Averaging during official US recession periods.",
      color: "orange"
    }
  ];

  // Courses data
  const courses = [
    {
      title: "DCA Masterclass",
      description: "Complete guide to Dollar Cost Averaging",
      tier: "Pro",
      price: 49,
      lessons: 12,
      duration: "2.5 hours",
      icon: Play,
      href: "/education"
    },
    {
      title: "Portfolio Construction Guide",
      description: "Build a diversified portfolio using DCA",
      tier: "Free",
      price: 0,
      icon: FileText,
      href: "/education"
    },
    {
      title: "Bear Market Strategies",
      description: "DCA strategies that work during downturns",
      tier: "Premium",
      price: 79,
      lessons: 8,
      duration: "1.5 hours",
      icon: Lock,
      href: "/pricing"
    }
  ];

  // Stats
  const stats = [
    { value: "50+", label: "Years of Data" },
    { value: "5", label: "Analysis Tools" },
    { value: "10K+", label: "Investors" },
    { value: "Free", label: "To Start" }
  ];

  // Newsletter subscription state
  let emailInput = $state("");
  let emailSubmitting = $state(false);
  let emailSubscribed = $state(false);

  async function handleNewsletterSubmit(e: Event) {
    e.preventDefault();
    if (!emailInput || emailSubmitting) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      alert("Please enter a valid email address");
      return;
    }

    emailSubmitting = true;

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, tier: "free" }),
      });

      const result = await response.json() as { success: boolean; message?: string };

      if (result.success) {
        emailSubscribed = true;
        emailInput = "";
        setTimeout(() => {
          emailSubscribed = false;
        }, 3000);
      } else {
        alert(result.message || "Subscription failed");
      }
    } catch {
      alert("Failed to subscribe. Please try again.");
    } finally {
      emailSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>DCA Insights - Master Dollar Cost Averaging with Data-Driven Tools</title>
  <meta
    name="description"
    content="Tools and courses to analyze and understand Dollar Cost Averaging (DCA) investment strategies. Historical S&P 500 analysis, calculators, and expert education."
  />
  <meta property="og:url" content={page.url.host + page.url.pathname} />
</svelte:head>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
    <div class="relative max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div class="text-center max-w-3xl mx-auto">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
        >
          <TrendingUp class="w-4 h-4" />
          Data-Driven Investment Insights
        </div>

        <!-- Headline -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Master Dollar Cost Averaging with
          <span class="text-blue-600">Historical Data</span>
        </h1>

        <!-- Subhead -->
        <p class="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Analyze 50+ years of S&P 500 data, compare strategies, and find optimal
          timing for your investments. Make informed decisions with real historical performance.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/sp500-dca-calculator"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:scale-105"
          >
            <Calculator class="w-5 h-5" />
            Start Calculating
            <ArrowRight class="w-4 h-4" />
          </a>
          <a
            href="/education"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-all hover:scale-105"
          >
            <BookOpen class="w-5 h-5" />
            Explore Courses
          </a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-slate-200">
          {#each stats as stat}
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
              <div class="text-sm text-slate-500">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Tools Section -->
  <section class="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        Powerful Analysis Tools
      </h2>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        Five specialized calculators powered by real S&P 500 historical data to help you
        make informed investment decisions.
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each tools as tool}
        <a
          href={tool.href}
          class="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
        >
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 {
              tool.color === 'blue'
                ? 'bg-blue-100 text-blue-600'
                : tool.color === 'green'
                  ? 'bg-green-100 text-green-600'
                  : tool.color === 'purple'
                    ? 'bg-purple-100 text-purple-600'
                    : tool.color === 'red'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-orange-100 text-orange-600'
            }"
          >
            <tool.icon class="w-6 h-6" />
          </div>

          <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {tool.title}
          </h3>

          <p class="text-slate-600 text-sm mb-4 line-clamp-2">
            {tool.description}
          </p>

          <div
            class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all"
          >
            Try it
            <ChevronRight class="w-4 h-4" />
          </div>
        </a>
      {/each}
    </div>

    <div class="text-center mt-10">
      <a
        href="/blog/ultimate-guide-to-dollar-cost-averaging"
        class="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
      >
        New to DCA? Read our comprehensive guide
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>
  </section>

  <!-- Educational Content Section -->
  <section class="py-16 md:py-24 px-4 md:px-8 bg-slate-50">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Learn from the Experts
        </h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          From beginner fundamentals to advanced strategies, our courses help you master
          systematic investing.
        </p>
      </div>

      <!-- Featured Course Card -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 mb-10 text-white">
        <div class="flex flex-col lg:flex-row gap-8 items-center">
          <div class="flex-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              <Play class="w-4 h-4" />
              Featured Course
            </div>

            <h3 class="text-2xl md:text-3xl font-bold mb-3">
              DCA Masterclass: Complete Guide to Dollar Cost Averaging
            </h3>

            <p class="text-blue-100 mb-6">
              Master the art of systematic investing with our comprehensive 2.5-hour video course.
              Perfect for investors who want to understand the data behind the strategy.
            </p>

            <div class="flex flex-wrap gap-4 text-sm text-blue-100 mb-6">
              <span class="flex items-center gap-1">
                <Clock class="w-4 h-4" />
                2.5 hours
              </span>
              <span>•</span>
              <span>12 lessons</span>
              <span>•</span>
              <span>Pro tier</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="/education"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <Play class="w-5 h-5" />
                Start Learning
              </a>
              <a
                href="/pricing"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                <Lock class="w-4 h-4" />
                Unlock for $49
              </a>
            </div>
          </div>

          <div class="lg:w-80 w-full">
            <div class="bg-white/10 backdrop-blur rounded-xl p-6">
              <h4 class="font-bold mb-4">Course Includes</h4>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-400" />
                  12 video lessons
                </li>
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-400" />
                  Downloadable resources
                </li>
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-400" />
                  Certificate of completion
                </li>
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-400" />
                  Lifetime access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="grid md:grid-cols-3 gap-6">
        {#each courses as course}
          <a
            href={course.href}
            class="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div class="flex items-start justify-between mb-4">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center {
                  course.tier === 'Free'
                    ? 'bg-green-100 text-green-600'
                    : course.tier === 'Pro'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                }"
              >
                <course.icon class="w-5 h-5" />
              </div>

              <span
                class="px-2 py-1 rounded-full text-xs font-medium {
                  course.tier === 'Free'
                    ? 'bg-green-100 text-green-700'
                    : course.tier === 'Pro'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                }"
              >
                {course.tier}
              </span>
            </div>

            <h4 class="font-bold text-slate-900 mb-2">{course.title}</h4>
            <p class="text-slate-600 text-sm mb-4">{course.description}</p>

            {#if course.lessons}
              <div class="flex items-center gap-2 text-sm text-slate-500">
                <Clock class="w-4 h-4" />
                <span>{course.duration}</span>
                <span>•</span>
                <span>{course.lessons} lessons</span>
              </div>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Blog Section -->
  <section class="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Latest from the Blog
        </h2>
        <p class="text-lg text-slate-600">
          Expert analysis, strategies, and insights on DCA and systematic investing.
        </p>
      </div>

      <a
        href="/blog"
        class="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 mt-4 md:mt-0"
      >
        View all articles
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each featuredPosts as post}
        <a
          href="/blog/{post.slug}"
          class="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all"
        >
          <div
            class="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
          >
            <span class="text-white text-4xl font-bold opacity-20">DCA</span>
          </div>

          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <span
                class="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
              >
                {post.category}
              </span>
            </div>

            <h3 class="font-bold text-lg mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p class="text-slate-600 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>

            <div class="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {post.readTime}
              </span>
              <span class="flex items-center gap-1 text-blue-600 font-medium">
                Read more
                <ArrowRight class="w-3 h-3" />
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- Pricing Preview -->
  <section class="py-16 md:py-24 px-4 md:px-8 bg-slate-900 text-white">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Start Free, Grow Your Portfolio
        </h2>
        <p class="text-lg text-slate-400 max-w-2xl mx-auto">
          All our calculators are free to use. Unlock premium tools, courses, and insights as
          you advance your investment journey.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Free -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-xl font-bold mb-2">Free</h3>
          <p class="text-slate-400 text-sm mb-4">Perfect for getting started</p>
          <div class="text-3xl font-bold mb-6">
            $0
            <span class="text-slate-500 text-sm font-normal">/month</span>
          </div>

          <ul class="space-y-3 mb-6">
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              All DCA calculators
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              Historical data access
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              Share results
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              Free guides
            </li>
          </ul>

          <a
            href="/sp500-dca-calculator"
            class="block w-full py-3 text-center bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Get Started
          </a>
        </div>

        <!-- Pro -->
        <div class="bg-blue-600 rounded-xl p-6 border-2 border-blue-400 relative">
          <div
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            Most Popular
          </div>

          <h3 class="text-xl font-bold mb-2">Pro</h3>
          <p class="text-blue-100 text-sm mb-4">For serious investors</p>
          <div class="text-3xl font-bold mb-6">
            $9
            <span class="text-blue-200 text-sm font-normal">/month</span>
          </div>

          <ul class="space-y-3 mb-6">
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-white" />
              Everything in Free
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-white" />
              DCA Masterclass course
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-white" />
              Priority support
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-white" />
              Advanced analytics
            </li>
          </ul>

          <a
            href="/pricing"
            class="block w-full py-3 text-center bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Get Pro
          </a>
        </div>

        <!-- Premium -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-xl font-bold mb-2">Premium</h3>
          <p class="text-slate-400 text-sm mb-4">For professionals & advisors</p>
          <div class="text-3xl font-bold mb-6">
            $29
            <span class="text-slate-500 text-sm font-normal">/month</span>
          </div>

          <ul class="space-y-3 mb-6">
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              Everything in Pro
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              All premium courses
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              Export reports (PDF)
            </li>
            <li class="flex items-center gap-2 text-sm">
              <CheckCircle class="w-4 h-4 text-green-400" />
              API access
            </li>
          </ul>

          <a
            href="/pricing"
            class="block w-full py-3 text-center bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Get Premium
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Newsletter Section -->
  <section class="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
      <Mail class="w-12 h-12 text-blue-600 mx-auto mb-4" />

      <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
        Stay Ahead of the Market
      </h2>

      <p class="text-slate-600 mb-6 max-w-xl mx-auto">
        Get the latest DCA strategies, market analysis, and investment insights delivered
        straight to your inbox. No spam, unsubscribe anytime.
      </p>

      <form onsubmit={handleNewsletterSubmit} class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          bind:value={emailInput}
          placeholder="Enter your email"
          class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={emailSubmitting}
        />
        <button
          type="submit"
          disabled={emailSubmitting}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {emailSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {#if emailSubscribed}
        <p class="text-sm text-green-600 mt-4 font-medium">
          ✓ You're subscribed! Check your inbox for confirmation.
        </p>
      {/if}

      <p class="text-sm text-slate-500 mt-4">
        Join 10,000+ investors receiving our newsletter
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-50 border-t border-slate-200 py-12 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="md:col-span-1">
          <a href="/" class="inline-flex items-center gap-2 mb-4">
            <img src="/logo.svg" alt="DCA Insights" class="h-10" />
          </a>
          <p class="text-sm text-slate-500">
            Data-driven insights for smarter dollar cost averaging investments.
          </p>
        </div>

        <!-- Tools -->
        <div>
          <h4 class="font-bold text-slate-900 mb-4">Tools</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="/sp500-dca-calculator" class="text-slate-600 hover:text-blue-600 transition-colors">
                DCA Calculator
              </a>
            </li>
            <li>
              <a href="/dca-vs-lump-sum" class="text-slate-600 hover:text-blue-600 transition-colors">
                DCA vs Lump Sum
              </a>
            </li>
            <li>
              <a href="/dca-timing-optimizer" class="text-slate-600 hover:text-blue-600 transition-colors">
                Timing Optimizer
              </a>
            </li>
            <li>
              <a href="/bear-market-dca" class="text-slate-600 hover:text-blue-600 transition-colors">
                Bear Market Analysis
              </a>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="font-bold text-slate-900 mb-4">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="/education" class="text-slate-600 hover:text-blue-600 transition-colors">
                Courses
              </a>
            </li>
            <li>
              <a href="/blog" class="text-slate-600 hover:text-blue-600 transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="/pricing" class="text-slate-600 hover:text-blue-600 transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="/affiliate" class="text-slate-600 hover:text-blue-600 transition-colors">
                Affiliate Program
              </a>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="font-bold text-slate-900 mb-4">Company</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="/about" class="text-slate-600 hover:text-blue-600 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="/disclaimer" class="text-slate-600 hover:text-blue-600 transition-colors">
                Disclaimer
              </a>
            </li>
            <li>
              <a href="/newsletter" class="text-slate-600 hover:text-blue-600 transition-colors">
                Newsletter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="text-sm text-slate-500">
          © 2026 DCA Insights. All rights reserved.
        </p>

        <div class="flex items-center gap-4">
          <a
            href="https://twitter.com"
            class="text-slate-400 hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener"
          >
            <Twitter class="w-5 h-5" />
          </a>
          <a
            href="https://github.com"
            class="text-slate-400 hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener"
          >
            <Github class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>
