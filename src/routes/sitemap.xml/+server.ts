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