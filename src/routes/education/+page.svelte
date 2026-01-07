<script lang="ts">
  import { Lock, Play, FileText, Download, ChevronRight, Check } from 'lucide-svelte';
  import { isPremium, userTier } from '$lib/stores/user';
  
  const courses = [
    {
      id: 'dca-masterclass',
      title: 'DCA Masterclass: Complete Guide to Dollar Cost Averaging',
      description: 'Master the art of systematic investing with our comprehensive video course',
      duration: '2.5 hours',
      lessons: 12,
      type: 'video',
      tier: 'pro' as const,
      price: 49,
      featured: true,
      topics: [
        'Understanding market volatility',
        'Building your investment strategy',
        'Portfolio allocation basics',
        'Rebalancing and optimization'
      ]
    },
    {
      id: 'bear-market-survival',
      title: 'Surviving Bear Markets: DCA Strategies That Work',
      description: 'Learn how to maintain discipline during market downturns',
      duration: '1.5 hours',
      lessons: 8,
      type: 'video',
      tier: 'premium' as const,
      price: 79,
      featured: false,
      topics: [
        'Psychology of market crashes',
        'Accumulation strategies',
        'When to increase contributions',
        'Exit strategies and indicators'
      ]
    },
    {
      id: 'portfolio-guide',
      title: 'Complete Portfolio Construction Guide',
      description: 'Build a diversified portfolio using DCA principles',
      type: 'guide',
      tier: 'free' as const,
      price: 0,
      featured: false,
      downloadUrl: '/downloads/portfolio-guide.pdf'
    },
    {
      id: 'tax-optimization',
      title: 'Tax-Optimized DCA Strategies',
      description: 'Maximize after-tax returns with smart DCA implementation',
      duration: '45 mins',
      lessons: 5,
      type: 'video',
      tier: 'premium' as const,
      price: 59,
      featured: false,
      topics: [
        'Tax-loss harvesting',
        'Account type optimization',
        'Asset location strategies',
        'Year-end planning'
      ]
    }
  ];
  
  let selectedCourse = $state<typeof courses[0] | null>(null);
  
  function canAccess(courseTier: string): boolean {
    const tier = $userTier as 'free' | 'pro' | 'premium';
    if (courseTier === 'free') return true;
    if (courseTier === 'pro' && (tier === 'pro' || tier === 'premium')) return true;
    if (courseTier === 'premium' && tier === 'premium') return true;
    return false;
  }
</script>

<svelte:head>
  <title>Educational Content - DCA Insights</title>
  <meta name="description" content="Premium educational content to master Dollar Cost Averaging" />
</svelte:head>

<main class="p-4 md:p-8 max-w-6xl mx-auto">
  <div class="text-center mb-12">
    <h1 class="text-3xl font-bold mb-4">Educational Content</h1>
    <p class="text-gray-600 max-w-2xl mx-auto">
      Deepen your investment knowledge with our curated courses, guides, and resources.
      From beginner fundamentals to advanced strategies.
    </p>
  </div>
  
  <!-- Featured Course -->
  {#if courses.find(c => c.featured)}
    {@const featured = courses.find(c => c.featured)!}
    <div class="border-2 border-blue-500 rounded-xl p-6 md:p-8 mb-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="flex-1">
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Play class="w-4 h-4" />
            Featured Course
          </span>
          
          <h2 class="text-2xl font-bold mb-3">{featured.title}</h2>
          <p class="text-gray-600 mb-4">{featured.description}</p>
          
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{featured.duration}</span>
            <span>•</span>
            <span>{featured.lessons} lessons</span>
            <span>•</span>
            <span class="capitalize">{featured.type}</span>
          </div>
          
          <div class="space-y-2 mb-6">
            {#each featured.topics as topic}
              <div class="flex items-center gap-2 text-sm">
                <ChevronRight class="w-4 h-4 text-blue-500" />
                <span>{topic}</span>
              </div>
            {/each}
          </div>
          
          <div class="flex items-center gap-4">
            {#if canAccess(featured.tier)}
              <button class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Play class="w-5 h-5" />
                Start Learning
              </button>
            {:else}
              <a 
                href="/pricing"
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Lock class="w-5 h-5" />
                Unlock for ${featured.price}
              </a>
            {/if}
          </div>
        </div>
        
        <div class="md:w-80">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-bold mb-4">Course Includes:</h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-2 text-sm">
                <Play class="w-4 h-4 text-blue-500 flex-none mt-0.5" />
                <span>{featured.lessons} video lessons</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <FileText class="w-4 h-4 text-blue-500 flex-none mt-0.5" />
                <span>Downloadable resources</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <Download class="w-4 h-4 text-blue-500 flex-none mt-0.5" />
                <span>Certificate of completion</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <ChevronRight class="w-4 h-4 text-blue-500 flex-none mt-0.5" />
                <span>Lifetime access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Course Grid -->
  <h2 class="text-xl font-bold mb-6">More Courses & Resources</h2>
  
  <div class="grid md:grid-cols-2 gap-6">
    {#each courses.filter(c => !c.featured) as course}
      <div class="border border-gray-200 rounded-xl p-6 bg-white hover:border-gray-300 transition-colors">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-2">
            {#if course.type === 'video'}
              <Play class="w-5 h-5 text-blue-500" />
            {:else}
              <FileText class="w-5 h-5 text-green-500" />
            {/if}
            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
              {course.type}
            </span>
          </div>
          
          {#if !canAccess(course.tier)}
            <span class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              <Lock class="w-3 h-3" />
              {course.tier === 'pro' ? 'Pro' : 'Premium'}
            </span>
          {:else}
            <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <Check class="w-3 h-3" />
              Unlocked
            </span>
          {/if}
        </div>
        
        <h3 class="font-bold text-lg mb-2">{course.title}</h3>
        <p class="text-gray-600 text-sm mb-4">{course.description}</p>
        
        {#if course.lessons}
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>{course.duration}</span>
            <span>•</span>
            <span>{course.lessons} lessons</span>
          </div>
        {/if}
        
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          {#if course.price === 0}
            <span class="text-lg font-bold text-green-600">Free</span>
            <a 
              href={course.downloadUrl}
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Download class="w-4 h-4" />
              Download
            </a>
          {:else if canAccess(course.tier)}
            <span class="text-lg font-bold text-gray-400">Included</span>
            <button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Play class="w-4 h-4" />
              Start Course
            </button>
          {:else}
            <span class="text-lg font-bold">${course.price}</span>
            <a 
              href="/pricing"
              class="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Lock class="w-4 h-4" />
              Unlock
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  
  <!-- CTA -->
  <div class="mt-12 text-center p-8 bg-gray-50 rounded-xl">
    <h3 class="text-xl font-bold mb-2">Want Full Access?</h3>
    <p class="text-gray-600 mb-4">
      Get unlimited access to all courses, guides, and premium content with a Premium subscription.
    </p>
    <a 
      href="/pricing"
      class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      View Plans
      <ChevronRight class="w-4 h-4" />
    </a>
  </div>
</main>
