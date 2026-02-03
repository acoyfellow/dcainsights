#!/bin/bash
# E2E Test Script - Run this before marking stories as complete
# QA-001: Link Validation and E2E Test Suite

# Don't exit on error - we track pass/fail manually
set +e

# Default to production URL if no local server
BASE_URL="${1:-https://dcainsights.com}"
PASS=0
FAIL=0

echo "=== DCA Insights E2E Test Suite ==="
echo "Testing: $BASE_URL"
echo ""

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ $name"
        ((PASS++))
    else
        echo "❌ $name (got $response, expected $expected_status)"
        ((FAIL++))
    fi
}

test_contains() {
    local name="$1"
    local url="$2"
    local expected="$3"
    
    response=$(curl -s "$url" 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "$expected"; then
        echo "✅ $name"
        ((PASS++))
    else
        echo "❌ $name (content mismatch - expected '$expected')"
        ((FAIL++))
    fi
}

test_api() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" "$url" 2>/dev/null)
    fi
    
    status=$(echo "$response" | tail -1)
    
    if [ "$status" -ge 200 ] && [ "$status" -lt 400 ]; then
        echo "✅ $name (status: $status)"
        ((PASS++))
    else
        echo "❌ $name (status: $status)"
        ((FAIL++))
    fi
}

test_no_broken_images() {
    local name="$1"
    local url="$2"
    
    # Fetch page and extract image src URLs
    html=$(curl -s "$url" 2>/dev/null || echo "")
    images=$(echo "$html" | grep -oE 'src="[^"]+\.(png|jpg|jpeg|gif|svg|webp|ico)"' | sed 's/src="//' | sed 's/"$//' | head -20)
    
    local broken=0
    for img in $images; do
        # Handle relative URLs
        if [[ "$img" == /* ]]; then
            img_url="$BASE_URL$img"
        elif [[ "$img" == http* ]]; then
            img_url="$img"
        else
            img_url="$BASE_URL/$img"
        fi
        
        img_status=$(curl -s -o /dev/null -w "%{http_code}" "$img_url" 2>/dev/null || echo "000")
        if [ "$img_status" != "200" ]; then
            echo "  ⚠️  Broken image: $img (status: $img_status)"
            broken=$((broken + 1))
        fi
    done
    
    if [ $broken -eq 0 ]; then
        echo "✅ $name (no broken images)"
        ((PASS++))
    else
        echo "❌ $name ($broken broken images)"
        ((FAIL++))
    fi
}

echo "=== 1. SITEMAP URL VALIDATION ==="
echo "Fetching sitemap from $BASE_URL/sitemap.xml..."

sitemap=$(curl -s "$BASE_URL/sitemap.xml" 2>/dev/null || echo "")
if [ -z "$sitemap" ]; then
    echo "❌ Could not fetch sitemap"
    ((FAIL++))
else
    echo "✅ Sitemap fetched successfully"
    ((PASS++))
    
    # Extract and test all URLs from sitemap
    urls=$(echo "$sitemap" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//g' | sed 's/<\/loc>//g')
    
    echo ""
    echo "--- Testing Sitemap URLs ---"
    for url in $urls; do
        path=$(echo "$url" | sed "s|$BASE_URL||")
        path=${path:-"/"}
        test_endpoint "Sitemap: $path" "$url"
    done
fi

echo ""
echo "=== 2. CALCULATOR TOOLS E2E TESTS ==="

echo ""
echo "--- S&P 500 DCA Calculator ---"
test_endpoint "Calculator Page Load" "$BASE_URL/sp500-dca-calculator"
test_contains "Calculator has investment input" "$BASE_URL/sp500-dca-calculator" "Investment Amount"
test_contains "Calculator has DCA description" "$BASE_URL/sp500-dca-calculator" "regular intervals"
test_contains "Calculator has meta description" "$BASE_URL/sp500-dca-calculator" "DCA"

echo ""
echo "--- DCA vs Lump Sum Comparison ---"
test_endpoint "DCA vs Lump Sum Page" "$BASE_URL/dca-vs-lump-sum"
test_contains "DCA vs LS has comparison" "$BASE_URL/dca-vs-lump-sum" "Lump Sum"

echo ""
echo "--- DCA Timing Optimizer ---"
test_endpoint "Timing Optimizer Page" "$BASE_URL/dca-timing-optimizer"
test_contains "Timing has day analysis" "$BASE_URL/dca-timing-optimizer" "day"

echo ""
echo "--- Bear Market DCA ---"
test_endpoint "Bear Market DCA Page" "$BASE_URL/bear-market-dca"
test_contains "Bear Market has crisis data" "$BASE_URL/bear-market-dca" "bear"

echo ""
echo "--- Recession DCA ---"
test_endpoint "Recession DCA Page" "$BASE_URL/recession-dca"
test_contains "Recession has economic data" "$BASE_URL/recession-dca" "recession"

echo ""
echo "=== 3. API ENDPOINT TESTS ==="

test_api "API Root" "$BASE_URL/api/"
test_api "Newsletter Subscribe" "$BASE_URL/api/newsletter/subscribe" "POST" '{"email":"e2e-test@test.com","tier":"free"}'
test_api "Newsletter Status" "$BASE_URL/api/newsletter/status"

# Test DCA calculation API (GET with required params)
test_endpoint "DCA Calculate API" "$BASE_URL/api/v1/dca/calculate?amount=500&interval=monthly"

echo ""
echo "=== 4. CHECKOUT FLOW E2E TESTS ==="

# Test pricing page loads (content is dynamically loaded via JS)
test_endpoint "Pricing Page" "$BASE_URL/pricing"
test_contains "Pricing has title" "$BASE_URL/pricing" "Pricing"
test_contains "Pricing has meta description" "$BASE_URL/pricing" "plan"

# Test Stripe checkout endpoint exists (should return error for invalid request, not 404)
stripe_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/stripe/checkout" \
    -H "Content-Type: application/json" \
    -d '{"priceId":"test"}' 2>/dev/null || echo "000")

# Accept 400/401/500 as "endpoint exists" vs 404 (not found)
if [ "$stripe_response" != "404" ] && [ "$stripe_response" != "000" ]; then
    echo "✅ Stripe Checkout Endpoint (exists, status: $stripe_response)"
    ((PASS++))
else
    echo "❌ Stripe Checkout Endpoint (not found, status: $stripe_response)"
    ((FAIL++))
fi

# Test subscription status endpoint (may require auth, 401/500 means endpoint exists)
sub_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/stripe/subscription" 2>/dev/null || echo "000")
if [ "$sub_response" != "404" ] && [ "$sub_response" != "000" ]; then
    echo "✅ Stripe Subscription Endpoint (exists, status: $sub_response)"
    ((PASS++))
else
    echo "❌ Stripe Subscription Endpoint (not found)"
    ((FAIL++))
fi

echo ""
echo "=== 5. SHARE LINK TESTS ==="

# Test share link creation
share_id="e2e-test-$(date +%s)"
share_response=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$BASE_URL/api/reports" \
    -H "Content-Type: application/json" \
    -d "{\"id\":\"$share_id\",\"data\":{\"amount\":500,\"frequency\":\"monthly\"}}" 2>/dev/null || echo "000")

if [ "$share_response" = "200" ]; then
    echo "✅ Share Link Creation"
    ((PASS++))
    
    # Test loading the created share link
    share_load=$(curl -s -o /dev/null -w "%{http_code}" \
        "$BASE_URL/api/reports?id=$share_id" 2>/dev/null || echo "000")
    
    if [ "$share_load" = "200" ]; then
        echo "✅ Share Link Loading"
        ((PASS++))
    else
        echo "❌ Share Link Loading (status: $share_load)"
        ((FAIL++))
    fi
else
    echo "❌ Share Link Creation (status: $share_response)"
    ((FAIL++))
fi

echo ""
echo "=== 6. CONTENT/BLOG PAGE TESTS ==="

test_endpoint "Blog Index" "$BASE_URL/blog"
test_endpoint "Blog: Ultimate Guide" "$BASE_URL/blog/ultimate-guide-to-dollar-cost-averaging"
test_endpoint "Blog: DCA vs Lump Sum" "$BASE_URL/blog/dca-vs-lump-sum-which-wins"
test_endpoint "Blog: Bear Market Guide" "$BASE_URL/blog/bear-market-survival-guide"
test_endpoint "Blog: Best Days to Invest" "$BASE_URL/blog/best-days-to-invest"
test_endpoint "Blog: Crypto vs Stocks" "$BASE_URL/blog/dca-crypto-vs-stocks"
test_endpoint "Blog: Retirement Wealth" "$BASE_URL/blog/how-to-build-retirement-wealth-with-dca"

echo ""
echo "=== 7. IMAGE/ASSET VALIDATION ==="

test_no_broken_images "Homepage images" "$BASE_URL/"
test_no_broken_images "Calculator images" "$BASE_URL/sp500-dca-calculator"
test_no_broken_images "Blog index images" "$BASE_URL/blog"

# Test static assets
test_endpoint "Favicon" "$BASE_URL/favicon.ico"
test_endpoint "Robots.txt" "$BASE_URL/robots.txt"
test_endpoint "RSS Feed" "$BASE_URL/rss.xml"

echo ""
echo "=== 8. NAVIGATION/INTERNAL LINKS ==="

# Test common navigation links exist and are valid
test_endpoint "About Page" "$BASE_URL/about"
test_endpoint "Disclaimer Page" "$BASE_URL/disclaimer"
test_endpoint "Newsletter Page" "$BASE_URL/newsletter"
test_endpoint "Education Page" "$BASE_URL/education"
test_endpoint "Affiliate Page" "$BASE_URL/affiliate"
test_endpoint "Link Page" "$BASE_URL/link"

echo ""
echo "========================================"
echo "=== RESULTS ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo "========================================"

if [ $FAIL -gt 0 ]; then
    echo ""
    echo "❌ Some tests failed. Fix before marking story complete."
    exit 1
else
    echo ""
    echo "✅ All tests passed!"
    exit 0
fi
