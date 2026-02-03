# DCA Insights - Orchestration & Worker Delegation Plan

**Status**: Ready for parallel execution
**Orchestrator**: Shelley (me)
**Workers**: Multiple subagent instances
**Goal**: Fix all fake products and verify all real ones

---

## DEFECT SUMMARY

| ID | Issue | Priority | Assigned Worker | Status |
|----|-------|----------|-----------------|--------|
| 1 | FAKE COURSES (alert() placeholder) | CRITICAL | Worker-Courses | PENDING |
| 2 | Hardcoded Stripe test price IDs | HIGH | Worker-Stripe | PENDING |
| 3 | 23 a11y form warnings | MEDIUM | Worker-A11y | PENDING |
| 4 | Verify all calculator tools | MEDIUM | Worker-Tools | PENDING |
| 5 | Verify blog/content links | LOW | Worker-Content | PENDING |

---

## WORKER TASKS

### Worker-Courses: Build Real Course Infrastructure
**Scope**: Create functional course system (replacing alert() placeholders)

**Tasks**:
1. Create route structure:
   - `/courses/[courseId]` - course detail page
   - `/courses/[courseId]/player` - video player
   - `/courses/[courseId]/lessons/[lessonId]` - lesson viewer

2. Build course data structure:
   - Course metadata (title, duration, lessons)
   - Lesson content (video URLs, transcripts, materials)
   - Progress tracking
   - Certificate generation

3. Replace `startCourse()` alert() with:
   - Auth check (pro/premium)
   - Route to actual course
   - Progress tracking
   - Completion certificate

4. Create video player component (minimal):
   - HTML5 video or iframe embed
   - Lesson navigation
   - Progress bar
   - Download materials button

5. Create course content (mock or real):
   - DCA Masterclass (12 lessons)
   - Bear Market Survival (8 lessons)
   - Tax-Optimized DCA (5 lessons)

**Deliverable**: Functional course system with working navigation
**Success Criteria**: 
- Click "Start Course" → routes to actual course page
- Can navigate lessons
- Shows progress
- No alert() calls

---

### Worker-Stripe: Verify & Fix Payment Integration
**Scope**: Ensure Stripe integration is production-ready

**Tasks**:
1. Verify Stripe account exists
2. Create or validate live price IDs:
   - Pro Monthly ($9.99/mo)
   - Pro Yearly ($99.99/yr)
   - Premium Monthly ($29.99/mo)
   - Premium Yearly ($299.99/yr)

3. Update `src/lib/server/stripe.ts`:
   - Remove hardcoded test IDs
   - Use environment variables only
   - Add validation on startup

4. Test checkout flow:
   - Navigate to /pricing
   - Select plan
   - Verify Stripe checkout loads
   - Verify success redirect works

5. Test webhook handling:
   - Verify webhook endpoint exists
   - Test subscription creation
   - Test subscription update
   - Test subscription cancellation

6. Verify user tier updates:
   - After payment → check user.tier = "pro" or "premium"
   - After cancellation → check user.tier = "free"

**Deliverable**: Working Stripe integration with test & live modes
**Success Criteria**:
- All price IDs in environment variables
- Checkout flow works
- Webhooks update user tier
- No hardcoded price IDs

---

### Worker-A11y: Fix Form Accessibility
**Scope**: Resolve 23 a11y warnings (label associations)

**Tasks**:
1. Fix each file with warnings:
   - `/sp500-dca-calculator/+page.svelte`
   - `/dca-vs-lump-sum/+page.svelte`
   - `/dca-timing-optimizer/+page.svelte`
   - `/bear-market-dca/+page.svelte`
   - `/recession-dca/+page.svelte`

2. For each label:
   - Add unique `id` to input
   - Add `for={id}` to label
   - Or use `<label><input /></label>`

3. Run `bun run check` to verify 0 errors

**Deliverable**: All forms accessible
**Success Criteria**:
- `bun run check` returns 0 errors
- All labels associated with inputs
- Screen readers can read all forms

---

### Worker-Tools: Verify All Calculators Work
**Scope**: Test each calculator tool end-to-end

**Tasks**:
1. Test `/sp500-dca-calculator`:
   - Page loads
   - Chart renders
   - Can change parameters
   - Results update
   - No JS errors

2. Test `/dca-vs-lump-sum`:
   - Page loads
   - Comparison chart renders
   - Can compare different scenarios
   - No JS errors

3. Test `/dca-timing-optimizer`:
   - Page loads
   - Analysis runs
   - Results display
   - No JS errors

4. Test `/bear-market-dca`:
   - Page loads
   - Bear market periods display
   - Can select period
   - Analysis runs
   - No JS errors

5. Test `/recession-dca`:
   - Page loads
   - Recession periods display
   - Can select period
   - Analysis runs
   - No JS errors

6. Export features (if available):
   - CSV export works
   - PDF export works

**Deliverable**: All tools verified functional
**Success Criteria**:
- All pages load
- No 404s or 500s
- Charts render
- Parameters work
- Export functions work

---

### Worker-Content: Verify Blog & Static Content
**Scope**: Ensure all blog posts and links work

**Tasks**:
1. Verify all blog posts:
   - Load without 500 errors
   - Have content (not empty)
   - Have correct metadata
   - List at `/blog` or similar

2. Verify internal links:
   - Navigation links work
   - Footer links work
   - Cross-post links work
   - No 404s

3. Verify static content:
   - `/downloads/portfolio-guide.pdf` exists
   - Downloads work
   - All pages have proper titles/meta

4. Check sitemap:
   - All pages listed
   - No dead links in sitemap

**Deliverable**: All content verified accessible
**Success Criteria**:
- All blog posts load
- All links work (no 404s)
- Downloads accessible
- Sitemap accurate

---

## ORCHESTRATION SEQUENCE

### Phase 1: Parallel Execution (Workers 1-5 run simultaneously)
```
Worker-Courses     [============================]
Worker-Stripe      [====================]
Worker-A11y        [==========]
Worker-Tools       [============================]
Worker-Content     [==================]
```

### Phase 2: Integration
- Merge all changes
- Resolve conflicts
- Run full test suite

### Phase 3: Final Verification
```bash
bun tsc          # TypeScript check
bun run check    # Svelte/lint check (0 errors)
bun run build    # Final build
```

### Phase 4: Commit & Deploy
```bash
git add .
git commit -m "Fix: Replace fake courses, Stripe integration, a11y forms"
git push origin main
```

---

## STATUS TRACKING

| Worker | Start | Phase 1 | Phase 2 | Phase 3 | Status |
|--------|-------|---------|---------|---------|--------|
| Courses | - | PENDING | - | - | 🔴 |
| Stripe | - | PENDING | - | - | 🔴 |
| A11y | - | PENDING | - | - | 🔴 |
| Tools | - | PENDING | - | - | 🔴 |
| Content | - | PENDING | - | - | 🔴 |
| **FINAL** | - | - | PENDING | PENDING | 🔴 |

---

## NOTES FOR WORKERS

- **Do NOT** commit individually
- **DO** coordinate with orchestrator
- **Focus** on your single task
- **Report** blockers immediately
- **Test** before returning output
- **Keep** responses SHORT (avoid token truncation)

---

## NEXT STEP

Orchestrator will dispatch workers simultaneously with detailed task cards.

