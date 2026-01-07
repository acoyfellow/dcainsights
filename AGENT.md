# AGENTS.md

This repo is operated by humans + coding agents using a Ralph-style loop:
**pick ONE story → implement → verify → commit → mark done → repeat**.

---

## STOP CONDITION (North Star)

Stop only when **$1M MRR** with **≥90% profit margin** has been generated **legally** in **Production Stripe** for **DCAinsights.com**.

Otherwise: keep shipping.

---

## What to ship (priority order)

1) **SEO traffic** (more keywords, more traffic, more revenue, frequent homepage updates, NEVER publish broken links, always update the blog, always update the sitemap, rss feed, etc.)
2) **Better tools** (more useful + faster + shareable)
3) **Monetization** (conversion lifts, paid exports, paid reports, subscriptions)
4) **Distribution** (X, partnerships, affiliates, sponsorships)

---

## Hard rules (non-negotiable)

### 1) Work must be in PRD
If it isn’t in `scripts/ralph/prd.json`, do not do it.

### 2) One story per iteration
Implement exactly ONE story per iteration.

### 3) Verify before commit
Before committing, you MUST run:
- `bun build`  (fixes any build errors)
- `bun tsc` (fixes any typescript errors)
- `bun test` (if it exists)
- UI changes: `bun dev` and verify in a browser
- `bun build` again (to make sure the build is working)

### 5) Memory is files
Persistent memory is ONLY:
- git commits
- `scripts/ralph/prd.json` (task truth)
- `scripts/ralph/progress.txt` (patterns + learnings)
- `@CHANGELOG.md` (private decisions/strategy)

### 6) Secrets are sacred
- Never commit secrets.
- Never paste secrets into logs/docs/issues.
- Never expose secret keys to client code.
- If unsure whether something is secret: treat it as secret.

### 7) Production Stripe Always On

---

## ENV / SECRETS (SOURCE OF TRUTH)

Secrets live only in:
- local `.env` (never committed)
- GitHub Actions Secrets

If a story needs a secret and it’s missing:
- STOP
- add it here
- add usage + scope notes in `@CHANGELOG.md`

### Stripe
- STRIPE_TEST_SECRET_KEY (server only)
- STRIPE_TEST_PUBLISHABLE_KEY (client ok)
- STRIPE_SECRET_KEY (server only)
- STRIPE_PUBLISHABLE_KEY (client ok)

### Cloudflare (deploy/ops)
- CLOUDFLARE_API_TOKEN (required for wrangler deploy + KV namespace creation)
  - Permissions: Workers & Pages:Edit, Account Settings:Read, Cache Purge:Edit
  - Get from: https://dash.cloudflare.com/profile/api-tokens
- CLOUDFLARE_ACCOUNT_ID (required for wrangler deploy)
  - Get from: Workers & Pages → Settings → Account ID
- CLOUDFLARE_ZONE_ID (optional: for cache purge via Cloudflare API)
  - Get from: DNS settings for dcainsights.com
- CLOUDFLARE_EMAIL (NOT NEEDED - only for legacy API key auth)

## Deployment (Native Cloudflare Workers/Pages)

**Cloudflare Workers/Pages deploys with `npx wrangler deploy`.**

```bash
# Deploy from local
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
npx wrangler deploy
```

Cloudflare Pages also auto-deploys on push to main if configured in dashboard.

## KV Namespace (Optional)

For persistent shareable report links across deployments:

1. Create token with KV permissions at https://dash.cloudflare.com/profile/api-tokens
2. Run: `npx wrangler kv:namespace create "REPORTS_KV"`
3. Update `wrangler.jsonc` with the namespace binding

Without KV, share links use in-memory storage (works within single deployment instance).

### Other
- GCP_API_KEY (document usage/scope in `@CHANGELOG.md`)
- GITHUB_API_KEY (server/CI only)
- X_HANDLE
- X_PASSWORD

---

## Repo assumptions (SvelteKit)

- This is a SvelteKit app.
- Cloudflare hosts the website and deploys from pushes to `main`.

---

## Iteration checklist (do in order)

1) Read `scripts/ralph/prd.json`
2) Read `scripts/ralph/progress.txt` (Codebase Patterns first)
3) Confirm correct branch:
   - use `prd.json.branchName`
4) Pick the ONE story with the lowest `priority` where `passes:false`
5) Implement ONLY that story
6) Run checks:
   - `bun tsc`
   - tests if present
   - `bun dev` + browser verification for UI changes
7) Update memory:
   - Append learnings to `scripts/ralph/progress.txt`
   - Append decisions/strategy to `@CHANGELOG.md`
   - Update nearest `@AGENT.md` only with reusable patterns/gotchas
8) Commit (green only):
   - `feat|fix|chore: [ID] - [Title]`
9) Update `scripts/ralph/prd.json`:
   - set story `passes:true`
10) Push

---

## Progress log format (`scripts/ralph/progress.txt`)

Top of file accumulates reusable patterns:

## Codebase Patterns
- (Add patterns here)

Append after each completed story:

## YYYY-MM-DD - [Story ID]
- What was implemented
- Files changed
- **Learnings:**
  - Patterns discovered
  - Gotchas encountered
---

---

## Completion signal

If ALL stories have `passes:true`, output exactly:

<promise>COMPLETE</promise>
