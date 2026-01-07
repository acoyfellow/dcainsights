#!/bin/bash
# Cloudflare + GitHub Secrets Setup for DCA Insights
# Run this locally after configuring Cloudflare

set -e

echo "=== DCA Insights Deployment Setup ==="
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not installed. Install from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub. Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Get Cloudflare credentials from user
read -p "Enter CLOUDFLARE_API_TOKEN: " -s CF_API_TOKEN
echo ""
read -p "Enter CLOUDFLARE_ACCOUNT_ID: " CF_ACCOUNT_ID
echo ""
read -p "Enter CLOUDFLARE_ZONE_ID: " CF_ZONE_ID
echo ""

# Set GitHub secrets
echo "Setting GitHub secrets..."

gh secret set CLOUDFLARE_API_TOKEN --body "$CF_API_TOKEN"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "$CF_ACCOUNT_ID"
gh secret set CLOUDFLARE_ZONE_ID --body "$CF_ZONE_ID"

echo ""
echo "✅ All secrets set successfully!"
echo ""
echo "To trigger deployment:"
echo "  git push origin main"
echo ""
echo "Or check status:"
echo "  gh run list --repo acoyfellow/dcainsights"
