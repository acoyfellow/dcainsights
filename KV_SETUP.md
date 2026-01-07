# Cloudflare KV Setup for DCA Insights

## Required: Create KV Namespace for Reports

The shareable report links feature (MON-002) requires a Cloudflare KV namespace. The current `wrangler.jsonc` has a placeholder ID that must be replaced with a real namespace.

### Steps:

1. **Create the KV namespace:**
   ```bash
   npx wrangler kv:namespace create "REPORTS_KV"
   ```

2. **Update `wrangler.jsonc`** with the namespace ID from step 1:
   ```json
   {
     "kv_namespaces": [
       {
         "binding": "REPORTS_KV",
         "id": "YOUR_ACTUAL_NAMESPACE_ID_HERE",
         "preview_id": "preview-reports-kv"
       }
     ]
   }
   ```

3. **Deploy with secrets:**
   ```bash
   npx wrangler deploy
   ```

### Required Environment Variables

Set these in Cloudflare dashboard or via wrangler secrets:

- `STRIPE_WEBHOOK_SECRET` - For Stripe webhook verification
- `CLOUDFLARE_ZONE_ID` - For cache purge in CI/CD (see `.github/workflows/deploy.yml`)

### Testing Locally

The API endpoints (`/api/reports` and `/api/events`) have in-memory fallbacks when KV is not available, so they work in `bun dev` mode without configuration.
