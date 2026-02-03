#!/bin/bash
# Auto-rescue + validation for course building
# Runs before every worker session

cd /home/exedev/dcainsights

echo "=== TypeScript Check ==="
export PATH="$HOME/.bun/bin:$PATH"
bun tsc 2>&1 | head -20 || echo "TypeScript check failed"

echo ""
echo "=== Git Status ==="
git status --short

echo ""
echo "=== Curriculum Status ==="
if [ -f curriculum/courses.json ]; then
  echo "courses.json exists"
  jq '.courses | length' curriculum/courses.json 2>/dev/null || echo "JSON parse error"
else
  echo "curriculum/courses.json not found - needed for curriculum worker"
fi

echo ""
echo "=== Lesson Scripts Status ==="
if [ -d curriculum/lessons ]; then
  COUNT=$(ls -1 curriculum/lessons/*.md 2>/dev/null | wc -l)
  echo "$COUNT lesson scripts in curriculum/lessons/"
else
  echo "No curriculum/lessons/ directory yet"
fi

echo ""
echo "=== Source Status ==="
echo "Routes exist: $(ls -d src/routes/courses 2>/dev/null && echo 'YES' || echo 'NO')"
echo "Components exist: $(ls src/lib/components/courses/ 2>/dev/null | wc -l) files"

echo ""
echo "=== Build Ready ==="
if [ -d .svelte-kit/output ]; then
  echo "Last built: $(stat -c %y .svelte-kit/output 2>/dev/null | cut -d. -f1)"
else
  echo "Not built yet (needs Node 20+)"
fi
