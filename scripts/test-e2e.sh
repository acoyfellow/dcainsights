#!/bin/bash
# E2E Test Script - Run this before marking stories as complete

set -e

BASE_URL="${1:-http://localhost:8787}"
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
        echo "❌ $name (content mismatch)"
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

echo "--- Page Load Tests ---"
test_endpoint "Homepage" "$BASE_URL/"
test_endpoint "Calculator" "$BASE_URL/sp500-dca-calculator"
test_endpoint "Education" "$BASE_URL/education"
test_endpoint "Pricing" "$BASE_URL/pricing"
test_endpoint "Blog" "$BASE_URL/blog"
test_endpoint "About" "$BASE_URL/about"
test_endpoint "Disclaimer" "$BASE_URL/disclaimer"

echo ""
echo "--- API Endpoint Tests ---"
test_api "Newsletter Subscribe" "$BASE_URL/api/newsletter/subscribe" "POST" '{"email":"test@test.com","tier":"free"}'
test_api "Newsletter Status" "$BASE_URL/api/newsletter/status"
test_api "API Root" "$BASE_URL/api/"

echo ""
echo "--- Content Tests ---"
test_contains "Homepage has title" "$BASE_URL/" "DCA Insights"
test_contains "Calculator has form" "$BASE_URL/sp500-dca-calculator" "Investment Amount"
test_contains "Education has courses" "$BASE_URL/education" "Course"
test_contains "Pricing has plans" "$BASE_URL/pricing" "Pro"

echo ""
echo "--- Interactive Feature Tests ---"

# Test share link generation (should not 500)
share_response=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$BASE_URL/api/reports" \
    -H "Content-Type: application/json" \
    -d '{"id":"test-report-123","data":{"a":100,"i":"monthly"}}' 2>/dev/null || echo "000")

if [ "$share_response" = "200" ]; then
    echo "✅ Share link creation"
    ((PASS++))
else
    echo "❌ Share link creation (status: $share_response)"
    ((FAIL++))
fi

# Test loading share link
share_load=$(curl -s -o /dev/null -w "%{http_code}" \
    "$BASE_URL/api/reports?id=test-report-123" 2>/dev/null || echo "000")

if [ "$share_load" = "200" ]; then
    echo "✅ Share link loading"
    ((PASS++))
else
    echo "❌ Share link loading (status: $share_load)"
    ((FAIL++))
fi

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ $FAIL -gt 0 ]; then
    echo ""
    echo "❌ Some tests failed. Fix before marking story complete."
    exit 1
else
    echo ""
    echo "✅ All tests passed!"
    exit 0
fi
