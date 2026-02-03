# DCA Insights - Agent Guide

Open source at github.com/acoyfellow/dcainsights. Work in public, positive, legal.

## What This Is

DCA Insights (dcainsights.com) - Educational tools and content for Dollar Cost Averaging investors.

**Stack:** SvelteKit, Tailwind, Cloudflare Pages, Stripe

## What We Sell

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Basic calculators, historical data |
| Pro | $9.99/mo | Advanced analytics, CSV export, ad-free |
| Premium | $29.99/mo | All Pro + courses, API, backtesting |

**Courses (Premium):**
- DCA Masterclass (2.5hrs, 12 lessons)
- Bear Market Survival (1.5hrs, 8 lessons)  
- Tax-Optimized DCA (45min, 5 lessons)

## Current State (QA NEEDED)

⚠️ **Known issues to fix:**
- Course videos are PLACEHOLDERS (just alert boxes)
- Need to verify all Stripe price IDs are real
- 23 svelte-check warnings
- Pre-push hook exists but disabled

## Tools We Have

- `/sp500-dca-calculator` - Main calculator
- `/dca-vs-lump-sum` - Comparison tool
- `/dca-timing-optimizer` - Best day to invest
- `/bear-market-dca` - Bear market analysis
- `/recession-dca` - Recession analysis
- `/blog` - SEO content
- `/education` - Courses (needs real content)
- `/pricing` - Subscription plans

## Before Any Push

```bash
export PATH="$HOME/.bun/bin:$PATH"
bun tsc          # Must pass
bun run check    # Must be 0 errors
bun run build    # Must succeed
```

## Priorities

1. **Make existing features WORK** - No fake placeholders
2. **QA everything** - Test all links, forms, payments
3. **Fix bugs** - Resolve warnings, broken paths
4. **Then** new content

## Secrets

Live in `.env` (never commit):
- STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY
- CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID

## Deploy

Push to `main` → Cloudflare auto-deploys
