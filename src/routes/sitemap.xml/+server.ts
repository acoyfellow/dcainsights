import type { RequestHandler } from './$types';

// Define all DCA Insights tools for the sitemap
const routes = [
  {
    url: '/',
    changeFreq: 'weekly',
    priority: '1.0',
    description: 'DCA Insights - Dollar Cost Averaging Investment Tools'
  },
  {
    url: '/sp500-dca-calculator',
    changeFreq: 'monthly',
    priority: '0.9',
    description: 'S&P 500 DCA Calculator - Historical Performance Analysis'
  },
  {
    url: '/dca-vs-lump-sum',
    changeFreq: 'monthly',
    priority: '0.9',
    description: 'DCA vs Lump Sum Comparison - Investment Strategy Analysis'
  },
  {
    url: '/dca-timing-optimizer',
    changeFreq: 'monthly',
    priority: '0.9',
    description: 'DCA Timing Optimizer - Investment Day Analysis'
  },
  {
    url: '/bear-market-dca',
    changeFreq: 'monthly',
    priority: '0.9',
    description: 'Bear Market DCA Analysis - Performance During Market Downturns'
  },
  {
    url: '/recession-dca',
    changeFreq: 'monthly',
    priority: '0.9',
    description: 'DCA During Recessions - Economic Downturn Analysis'
  },
  {
    url: '/blog',
    changeFreq: 'weekly',
    priority: '0.8',
    description: 'DCA Insights Blog - Investment Strategies and Analysis'
  },
  {
    url: '/blog/ultimate-guide-to-dollar-cost-averaging',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'The Ultimate Guide to Dollar Cost Averaging in 2026'
  },
  {
    url: '/blog/dca-vs-lump-sum-which-wins',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'DCA vs Lump Sum: Which Investment Strategy Wins?'
  },
  {
    url: '/blog/bear-market-survival-guide',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'Bear Market Survival Guide - DCA Strategy for Down Markets'
  },
  {
    url: '/blog/best-days-to-invest',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'Best Days to Invest: Does Timing Really Matter?'
  },
  {
    url: '/blog/dca-crypto-vs-stocks',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'DCA Crypto vs Stocks: Which Returns More?'
  },
  {
    url: '/blog/how-much-to-invest-monthly-dca-guide',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'How Much Should You Invest Monthly? Complete DCA Amount Guide with Calculator'
  },
  {
    url: '/blog/best-sp500-index-funds-for-dca',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'Best S&P 500 Index Funds for DCA: VOO vs SPY vs IVV Comparison'
  },
  {
    url: '/blog/how-to-build-retirement-wealth-with-dca',
    changeFreq: 'monthly',
    priority: '0.7',
    description: 'How to Build Retirement Wealth with Dollar Cost Averaging'
  },
  {
    url: '/about',
    changeFreq: 'monthly',
    priority: '0.6',
    description: 'About DCA Insights - Our Mission'
  },
  {
    url: '/pricing',
    changeFreq: 'monthly',
    priority: '0.6',
    description: 'DCA Insights Pricing - Subscription Plans'
  },
  {
    url: '/education',
    changeFreq: 'monthly',
    priority: '0.6',
    description: 'DCA Investment Education - Courses and Resources'
  },
  {
    url: '/newsletter',
    changeFreq: 'monthly',
    priority: '0.5',
    description: 'DCA Insights Newsletter - Investment Insights'
  },
  {
    url: '/affiliate',
    changeFreq: 'monthly',
    priority: '0.5',
    description: 'DCA Insights Affiliate Program - Partner with Us'
  },
  {
    url: '/link',
    changeFreq: 'monthly',
    priority: '0.5',
    description: 'DCA Insights - Quick Links'
  }
];

export const GET: RequestHandler = async ({ url }) => {
  const baseUrl = url.origin;
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changeFreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${currentDate}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
} 