# Ralph Loop Testing Framework

## Pre-Deployment Checklist

Run this BEFORE marking a story as complete:

### 1. Basic Functionality
```bash
# Start dev server
npx wrangler dev -- bun dev

# Check in browser (localhost:8787)
# - [ ] Homepage loads
# - [ ] Newsletter form submits
# - [ ] Calculator works
# - [ ] Share link generates
# - [ ] Share link loads
# - [ ] Education page loads
# - [ ] Course buttons work
# - [ ] Pricing page loads
# - [ ] Blog pages load
```

### 2. API Endpoints (via curl or browser console)
```javascript
// In browser console:
await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'test@test.com', tier: 'free'})
}).then(r => r.json()).then(console.log)
```

### 3. Expected Behaviors

| Feature | Expected Result |
|---------|----------------|
| Newsletter subscribe | Success message, no 500 |
| Calculator export (free) | Redirect to /pricing |
| Calculator export (pro) | Downloads CSV |
| Share link | Generates UUID, copies to clipboard |
| Load share link | Loads scenario parameters |
| Course start (free) | Redirect to /pricing |
| Course start (paid) | Alert/modal (no backend needed) |

### 4. Error States (should NOT be 500)
- Unauthenticated API calls → 401
- Missing fields → 400
- Not found → 404
- External service down → graceful degradation

## Common Issues & Fixes

### 500 on api/user/me
- **Cause**: Auth header present but invalid/expired
- **Fix**: Handle 401 gracefully (user not logged in)

### 500 on api/stripe/checkout
- **Cause**: Stripe not configured
- **Fix**: Check `if (!stripe)` returns 500 - expected in dev

### Share links not working
- **Check**: KV binding in wrangler.jsonc
- **Dev**: Uses in-memory fallback (works per-instance)

## Testing Commands

```bash
# Full test suite
bash scripts/test-e2e.sh

# Quick smoke test
bash scripts/smoke-test.sh

# Test specific feature
bash scripts/test-feature.sh newsletter
```
