#!/bin/bash
# Create Cloudflare KV namespace and update wrangler.jsonc
# Run this locally with your Cloudflare credentials

set -e

echo "=== Creating Cloudflare KV Namespace ==="
echo ""

# Get credentials from user
read -p "CLOUDFLARE_API_TOKEN: " -s CF_API_TOKEN
echo ""
read -p "CLOUDFLARE_ACCOUNT_ID: " CF_ACCOUNT_ID
echo ""

# Create KV namespace
echo "Creating KV namespace..."
RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/storage/kv/namespaces" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "DCA Insights Reports"}')

# Extract namespace ID
KV_ID=$(echo $RESPONSE | jq -r '.result.id // empty')

if [ -z "$KV_ID" ]; then
  echo "Failed to create KV namespace:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Created KV namespace: $KV_ID"
echo ""

# Update wrangler.jsonc
echo "Updating wrangler.jsonc..."
cat wrangler.jsonc | sed "s/\"id\": \"[a-f0-9]\{32\}\"/\"id\": \"$KV_ID\"/" > wrangler.jsonc.tmp
mv wrangler.jsonc.tmp wrangler.jsonc

echo "✅ Updated wrangler.jsonc with namespace ID"
echo ""

# Commit and push
echo "Committing changes..."
git add wrangler.jsonc
git commit -m "feat: Add real Cloudflare KV namespace for shareable reports

Created via Cloudflare API:
- KV Namespace ID: $KV_ID"

git push origin main

echo ""
echo "✅ Deployed! Cloudflare Pages will auto-deploy from git."
echo ""
echo "KV namespace $KV_ID is now ready for shareable report links."
