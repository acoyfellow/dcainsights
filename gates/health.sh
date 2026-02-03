#!/bin/bash
# gates/health.sh - DCA Insights health check
# exit 0 = healthy, exit 1 = blockers

export PATH="$HOME/.bun/bin:$HOME/bin:$PATH"
cd "$(dirname "$0")/.." || exit 1

echo "🔍 Running health checks..."

# Auto-rescue uncommitted work
UNCOMMITTED=$(git status --porcelain | grep -E "^( M|M |\?\?)" | head -10)
if [ -n "$UNCOMMITTED" ]; then
  echo "⚠️ Uncommitted work found - auto-committing..."
  
  # Stage modified files
  git status --porcelain | grep -E "^( M|M )" | awk '{print $2}' | xargs -r git add
  
  # Stage new code files (not temp files)
  git status --porcelain | grep -E "^\?\?" | awk '{print $2}' | \
    grep -E "\.(ts|js|svelte|json|md|sh|css)$" | xargs -r git add
  
  # Commit with rescue message
  if ! git diff --cached --quiet; then
    git commit -m "Auto-rescue: uncommitted work from previous session"
    echo "✅ Committed rescued work"
  fi
fi

# Type check
echo "📝 Type checking..."
ERRORS=$(bun tsc 2>&1 | grep -E "error TS" | head -10)
if [ -n "$ERRORS" ]; then
  echo "❌ Type errors - FIX FIRST:"
  echo "$ERRORS"
  exit 1
fi
echo "✅ Type check passed"

# Build check
echo "🔨 Building..."
BUILD_OUTPUT=$(bun run build 2>&1)
if [ $? -ne 0 ]; then
  echo "❌ Build failed:"
  echo "$BUILD_OUTPUT" | tail -20
  exit 1
fi
echo "✅ Build passed"

# Report current state
echo ""
echo "📊 Project Status:"
echo "- Branch: $(git branch --show-current)"
echo "- Commits ahead: $(git rev-list --count origin/main..HEAD 2>/dev/null || echo '0')"

# Show next task from PRD
if [ -f scripts/ralph/prd.json ]; then
  NEXT_TASK=$(cat scripts/ralph/prd.json | grep -A5 '"passes": false' | head -6)
  if [ -n "$NEXT_TASK" ]; then
    echo ""
    echo "📋 Next task:"
    echo "$NEXT_TASK"
  fi
fi

echo ""
echo "✅ Health check complete - ready to work"
exit 0
