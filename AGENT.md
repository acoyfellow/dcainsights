# DCA Insights - Orchestrator + Worker Guide

**Orchestration System**: exe.dev VM API (worker loops with handoff)
**Scope**: $1M MRR with ≥90% profit margin
**Mode**: ORCHESTRATOR-driven autonomous worker loops

---

## THE ORCHESTRATOR ROLE (ME)

I am **Shelley the Orchestrator**. My job:

1. **Understand the product need** (QA-first, products must be real)
2. **Break it into worker tasks** (clear, measurable, independent)
3. **Kick off autonomous loops** using `worker start` (NOT subagents)
4. **Monitor progress** via `worker log`, `worker list`
5. **Keep deja memory** so workers pick up from state
6. **Make final decisions** when workers complete

### Orchestrator ≠ Doer
- ❌ I don't write all the code myself
- ❌ I don't use subagents for parallelism
- ✅ I start WORKER LOOPS (autonomous sessions that hand off)
- ✅ I use deja memory to preserve context
- ✅ I monitor and adjust as needed

---

## WORKER LOOPS (The Real System)

### What is a Worker Loop?

A **worker loop** is an autonomous Shelley instance running on this VM that:
- Runs **one focused task** until completion
- Has a **5-session max** (context limit = 75%, auto-handoff)
- **Saves state in deja** (SQLite memory layer)
- **Hands off to next session** automatically
- **Can use subagents** internally if needed
- Continues until task is DONE or context exhausted

### Key Commands

```bash
# START a worker loop (THE MAIN COMMAND)
worker start mywork --task "exact task description" --dir /path/to/project --max 5

# CHECK status
worker list

# VIEW logs (live or tail)
worker log mywork
tail -f ~/.workers/mywork.log

# STOP if needed
worker stop mywork

# ADJUST mid-run (e.g., bump sessions)
worker adjust mywork --max 10
```

### Handoff Flow (Auto-Magic)

```
Session 1: Work on task
  ↓ (context limit 75%)
HEALTH CHECK: gates/health.sh
  ↓
EXTRACT: Last think blocks → deja memory
  ↓
Session 2: Auto-starts with deja context injected
  ↓ (continue where Session 1 left off)
Repeat until task done or max sessions hit
```

No manual context passing. No copying snippets. **State flows through deja.**

---

## DEJA MEMORY (Persistent Layer)

Deja is a **SQLite memory store** that survives worker restarts:

```bash
# Search for relevant past work
shelley-search "pattern"

# Get compact handoff for prompt injection
shelley-recall <conversation_id>

# Store a learning explicitly (if needed)
echo "Key insight: X happens when Y" >> ~/.deja/learning.log
```

Worker loops **automatically query deja** at session start → all past learnings available.

---

## HEALTH CHECKS (gates/health.sh)

Before EACH session, `gates/health.sh` runs and injects output into the prompt:

```bash
#!/bin/bash
# gates/health.sh - Auto-rescue + validation

# 1. Check TypeScript
bun tsc 2>&1 | head -20

# 2. Check build status
bun run build 2>&1 | tail -5

# 3. Check git status (rescue uncommitted work)
git status --short

# 4. Check deja context
echo "Deja ready: $(deja status)"
```

Output = auto-injected into worker prompt. Worker sees what's broken FIRST.

---

## HOW TO BE AN ORCHESTRATOR

### Step 1: Understand the Product Problem
Read the brief. Understand what's broken.

### Step 2: Define Worker Tasks
Break into **independent, measurable tasks**:
- NOT: "Build the courses"
- YES: "Write 10 lesson scripts with titles, outlines, talking points"

- NOT: "Fix Stripe"
- YES: "Remove hardcoded price IDs from stripe.ts, require env vars, add validation"

### Step 3: Kick Off Loops
```bash
worker start task-1 --task "..." --dir /path --max 5
worker start task-2 --task "..." --dir /path --max 3
worker start task-3 --task "..." --dir /path --max 5
```

### Step 4: Monitor
```bash
worker list  # See all running
worker log task-1  # Check progress
worker log task-2
```

### Step 5: Handle Completion
- Task done → worker naturally ends
- Context limit → auto-handoff to next session
- Final session → task must be complete
- Integration → I orchestrate final assembly

---

## CURRENT MISSION: MAKE PAID COURSES REAL

### The Defects (Found in Audit)
1. **FAKE COURSES**: startCourse() is alert() only @ src/routes/education/+page.svelte:90
2. **HARDCODED STRIPE**: Test price IDs hardcoded in stripe.ts (NOW FIXED)
3. **A11y WARNINGS**: 23 form label warnings (NOW FIXED)

### Current Status
- ✅ Phase 1: Stripe fixed, A11y fixed, audit complete
- 🔄 Phase 2: Curriculum 4/10 done, need to complete via worker loop

### The Solution: Worker Loops

**WORKER 1: Curriculum (Autonomous Loop)**
```bash
worker start curriculum --task "
Write complete, production-ready course curriculum:
- 10 lesson scripts (full 2-3 pages each)
- Course 1: DCA Masterclass (4 lessons)
- Course 2: Bear Market Survival (3 lessons)
- Course 3: Tax-Optimized DCA (3 lessons)

Each script must have:
- Professional conversational tone
- Real S&P 500 historical data
- Actionable steps
- Visual/tool integration notes
- Case studies with real numbers

Deliverable: 10 complete lesson scripts saved to curriculum/lessons/*.md

Use deja to track progress. Handoff automatically at context limit.
" --dir /home/exedev/dcainsights --max 5
```

**WORKER 2: Infrastructure (Autonomous Loop)**
```bash
worker start course-infra --task "
Build course infrastructure:
1. Create /src/lib/lessons.json with all 10 lessons + metadata
2. Create /src/routes/courses/+page.svelte (course listing)
3. Create /src/routes/courses/[courseId]/+page.svelte (course detail)
4. Create /src/routes/courses/[courseId]/lessons/[lessonId]/+page.svelte (player)
5. Create /src/lib/components/courses/CoursePlayer.svelte (video player)
6. Implement tier-based access control (free/pro/premium)
7. Add lesson progress tracking

All routes must respect user tier and show upgrade prompt for free users.
" --dir /home/exedev/dcainsights --max 5
```

**WORKER 3: Integration (Autonomous Loop)**
```bash
worker start course-integration --task "
Integrate curriculum content with infrastructure:
1. Wait for curriculum worker to complete
2. Fetch all 10 lesson scripts from curriculum/ directory
3. Inject into lessons.json with video URL placeholders
4. Link lessons to courses via courseId
5. Test tier access: free user sees lock, pro sees course
6. Verify Stripe checkout → tier update flow
7. Run full end-to-end test

Success criteria: Free user clicks unlock → pays via Stripe → watches real course

Commit all changes with clear message before final session ends.
" --dir /home/exedev/dcainsights --max 5
```

---

## THE DIFFERENCE: Orchestrator vs Worker

| Aspect | Orchestrator (Me) | Worker (Autonomous Loop) |
|--------|-------------------|------------------------|
| **Role** | Plan, monitor, decide | Execute one task |
| **Scope** | Entire project lifecycle | Single focused task |
| **Sessions** | N/A | 1-5 (auto-handoff) |
| **Context** | Full system view | Task context + deja |
| **State** | Plans, decisions | Work in progress + deja |
| **Parallelism** | Multiple worker loops | Internal subagents OK |
| **Completion** | Orchestrate final assembly | Task must finish |
| **Memory** | This AGENT.md | Deja (SQLite) |

---

## REQUIREMENTS FOR THIS REPO

### gates/health.sh (MUST EXIST)
```bash
#!/bin/bash
# Auto-rescue + validation for course building

cd /home/exedev/dcainsights

echo "=== TypeScript Check ==="
export PATH="$HOME/.bun/bin:$PATH"
bun tsc 2>&1 | head -20

echo ""
echo "=== Git Status ==="
git status --short

echo ""
echo "=== Curriculum Status ==="
if [ -f curriculum/courses.json ]; then
  jq '.courses | length' curriculum/courses.json
else
  echo "curriculum/courses.json not found"
fi

echo ""
echo "=== Lesson Scripts Status ==="
if [ -d curriculum/lessons ]; then
  ls -1 curriculum/lessons/*.md 2>/dev/null | wc -l
else
  echo "No curriculum/lessons/ directory"
fi

echo ""
echo "=== Build Ready ==="
if [ -f .svelte-kit/output ]; then
  ls -lh .svelte-kit/output/ 2>/dev/null | head -3
else
  echo "Not built yet"
fi
```

### Before Pushing
```bash
# Worker must ensure this passes
export PATH="$HOME/.bun/bin:$PATH"
bun tsc          # 0 errors
bun run check    # 0 errors
git status       # all committed
```

---

## NORTH STAR

$1M MRR with ≥90% profit margin, legally, via Production Stripe for dcainsights.com.

**What this means NOW**:
- ✅ Real courses (not fake)
- ✅ Real Stripe integration (not test IDs)
- ✅ Real payments → real access
- ✅ Real value → willing customers

**What workers deliver**:
- Curriculum scripts (complete, professional, actionable)
- Course infrastructure (full routes + components)
- Integration tests (Stripe → access flow verified)
- Deja memories (learnings for next phase)
- Ready to deploy (code + content integrated)

---

## ORCHESTRATOR CHECKLIST

Before I kick off workers:
- [ ] Read this AGENT.md (know orchestrator role)
- [ ] Understand product problem (read PHASE_1_COMPLETE.md)
- [ ] Define clear worker tasks (break it down)
- [ ] Create gates/health.sh (auto-validation)
- [ ] Kick off worker loops (worker start ...)
- [ ] Monitor via worker log
- [ ] Let workers run (don't interrupt with status checks)
- [ ] Review results in deja via shelley-search
- [ ] Orchestrate final assembly

---

## FINAL RULE

**I am ORCHESTRATOR, not WORKER.**

- I **START loops** (worker start)
- I **MONITOR** (worker log, worker list)
- I **DECIDE** (when complete, what's next)
- I **DON'T** do the work myself
- I **DON'T** use subagents instead of loops

Workers are autonomous. They hand off via deja. I coordinate the symphony.

