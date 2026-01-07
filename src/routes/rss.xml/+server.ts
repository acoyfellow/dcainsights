import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DCA Insights - Dollar Cost Averaging Strategies</title>
    <link>https://dcainsights.com</link>
    <description>Expert analysis and guides on Dollar Cost Averaging strategies, market analysis, and investment insights.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://dcainsights.com/rss.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>The Ultimate Guide to Dollar Cost Averaging in 2026</title>
      <link>https://dcainsights.com/blog/ultimate-guide-to-dollar-cost-averaging</link>
      <description>Learn how DCA works, why it beats timing the market, and how to implement it for long-term wealth building.</description>
      <pubDate>Sat, 05 Jan 2026 00:00:00 GMT</pubDate>
      <guid>https://dcainsights.com/blog/ultimate-guide-to-dollar-cost-averaging</guid>
      <category>Strategy</category>
    </item>
    
    <item>
      <title>DCA vs Lump Sum: The Data Says...</title>
      <link>https://dcainsights.com/blog/dca-vs-lump-sum-which-wins</link>
      <description>We analyzed 50 years of S&P 500 data to settle the debate once and for all.</description>
      <pubDate>Fri, 03 Jan 2026 00:00:00 GMT</pubDate>
      <guid>https://dcainsights.com/blog/dca-vs-lump-sum-which-wins</guid>
      <category>Analysis</category>
    </item>
    
    <item>
      <title>Bear Market Survival Guide: Keep Buying</title>
      <link>https://dcainsights.com/blog/bear-market-survival-guide</link>
      <description>Historical data shows the best strategy during market crashes is counterintuitive.</description>
      <pubDate>Wed, 01 Jan 2026 00:00:00 GMT</pubDate>
      <guid>https://dcainsights.com/blog/bear-market-survival-guide</guid>
      <category>Strategy</category>
    </item>
    
    <item>
      <title>Best Days to Invest: Does Timing Matter?</title>
      <link>https://dcainsights.com/blog/best-days-to-invest-dca</link>
      <description>Analyzing 10 years of data to find optimal DCA timing patterns.</description>
      <pubDate>Sun, 28 Dec 2025 00:00:00 GMT</pubDate>
      <guid>https://dcainsights.com/blog/best-days-to-invest-dca</guid>
      <category>Analysis</category>
    </item>
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};