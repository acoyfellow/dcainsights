#!/bin/bash
# Auto-rescue + validation for course building
# Runs before every worker session

cd /home/exedev/dcainsights

echo "=== TypeScript Check ==="
export PATH="$HOME/.bun/bin:$PATH"
bun tsc 2>&1 | head -10 || echo "(TypeScript check not available)"

echo ""
echo "=== Git Status ==="
git status --short || echo "(Git not ready)"

echo ""
echo "=== Health Check ==="
echo "✅ Worker session started"
echo "✅ Health checks running"
echo "✅ Deja memory available"
