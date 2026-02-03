# DCA Insights - Orchestrator Guide

**Scope:** 1000 iterations toward $1M MRR
**Mode:** Single worker, QA-first, product quality focus

## North Star

$1M MRR with ≥90% profit margin, legally, via Production Stripe for dcainsights.com.

## Current Priority: PRODUCT AUDIT

**Status**: AUDIT COMPLETE - DEFECTS IDENTIFIED
**Build**: ✅ Passes | **TypeScript**: ✅ Passes | **Warnings**: 23 (a11y)

We sell courses and tools. If they don't work, the business is trash.

### What We Sell

| Tier | Price | Status |
|------|-------|--------|
| Free | $0 | ⚠️ Calculators need verification |
| Pro | $9.99/mo | ❌ Stripe price IDs hardcoded (test) |
| Premium | $29.99/mo | ❌ Courses are FAKE |

### Courses (CRITICAL - Currently Broken)

| Course | Tier | Status |
|--------|------|--------|
| DCA Masterclass (2.5hrs) | Pro | ❌ alert() placeholder @ line 90 |
| Bear Market Survival (1.5hrs) | Premium | ❌ alert() placeholder @ line 90 |
| Tax-Optimized DCA (45min) | Premium | ❌ alert() placeholder @ line 90 |
| Portfolio Guide PDF | Free | ⚠️ Verify exists & works |

### CRITICAL DEFECTS (Orchestrator Found)
1. **FAKE COURSES**: `src/routes/education/+page.svelte:90` - startCourse() is alert() only
2. **HARDCODED STRIPE IDs**: `src/lib/server/stripe.ts:16-27` - test price IDs, not live
3. **23 a11y WARNINGS**: Form labels not associated with inputs

## Audit Checklist (Do First)

### Phase 1: Payment Flow
- [ ] Verify Stripe price IDs are real (not placeholder strings)
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook updates user tier
- [ ] Test subscription cancellation

### Phase 2: Pro Features
- [ ] CSV export actually works
- [ ] PDF export actually works
- [ ] Advanced analytics dashboard exists and functions

### Phase 3: Premium Features (Courses)
- [ ] Either BUILD real course content OR
- [ ] REMOVE fake courses from product
- [ ] Don't sell what doesn't exist

### Phase 4: All Tools
- [ ] /sp500-dca-calculator - full test
- [ ] /dca-vs-lump-sum - full test
- [ ] /dca-timing-optimizer - full test
- [ ] /bear-market-dca - full test
- [ ] /recession-dca - full test

### Phase 5: Content
- [ ] All blog posts render (no 500s)
- [ ] All internal links work
- [ ] Sitemap accurate

## Stack

SvelteKit, Tailwind, Cloudflare Pages, Stripe

## Before Any Push

```bash
export PATH="$HOME/.bun/bin:$PATH"
bun tsc          # Must pass
bun run check    # 0 errors required
bun run build    # Must succeed
```

## Secrets (in .env, never commit)

- STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY
- CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID

## Deploy

Push to `main` → Cloudflare auto-deploys

## Rules

1. One task at a time
2. Verify before commit
3. Don't sell fake products
4. Keep responses SHORT (avoid token truncation)
5. Update this file with progress
