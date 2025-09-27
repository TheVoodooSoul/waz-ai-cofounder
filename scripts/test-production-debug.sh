
#!/bin/bash

echo "🔍 Testing Production Debug Endpoint"
echo "===================================="

DEBUG_URL="https://www.wazgine.com/api/debug/database?admin=debug_waz_2024"
AUTH_URL="https://www.wazgine.com/api/auth/providers"

echo "1. Testing NextAuth API (should work)..."
echo "URL: $AUTH_URL"
echo ""
curl -s "$AUTH_URL" | jq . || echo "❌ NextAuth API failed"

echo ""
echo "2. Testing Debug Endpoint..."
echo "URL: $DEBUG_URL"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" "$DEBUG_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Debug endpoint is working!"
    echo "Response:"
    echo "$BODY" | jq .
    
    # Check specific fields
    echo ""
    echo "📊 Key Information:"
    echo "==================="
    
    ADMIN_EXISTS=$(echo "$BODY" | jq -r '.admin_user != null')
    DB_CONNECTED=$(echo "$BODY" | jq -r '.database.connected')
    NEXTAUTH_URL=$(echo "$BODY" | jq -r '.environment.nextauth_url')
    USER_COUNT=$(echo "$BODY" | jq -r '.database.user_count')
    
    echo "Database Connected: $DB_CONNECTED"
    echo "Admin User Exists: $ADMIN_EXISTS"
    echo "NextAuth URL: $NEXTAUTH_URL"
    echo "Total Users: $USER_COUNT"
    
    if [ "$ADMIN_EXISTS" = "true" ] && [ "$DB_CONNECTED" = "true" ]; then
        echo ""
        echo "✅ Database and admin user are properly configured!"
        echo "🔑 Try logging in with: admin@waz.com / admin123"
        echo ""
        echo "If login still fails, check Vercel Function logs:"
        echo "https://vercel.com/dashboard → Your Project → Functions"
    else
        echo ""
        echo "❌ Database or admin user issue detected!"
        echo "Run: ./scripts/fix-admin-user.ts"
    fi
    
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Debug endpoint not found (404)"
    echo "This indicates a deployment sync issue!"
    echo ""
    echo "🚀 Solutions:"
    echo "1. Run: ./scripts/force-vercel-redeploy.sh"
    echo "2. Or go to Vercel Dashboard → Deployments → Redeploy with 'Clear Build Cache'"
    echo "3. Or disable Skew Protection in Vercel Settings → Functions"
    
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Unauthorized (401) - Wrong admin key"
    echo "The debug endpoint exists but rejected the admin key"
    
else
    echo "❌ Unexpected response (HTTP $HTTP_CODE)"
    echo "Response:"
    echo "$BODY"
fi

echo ""
echo "🔗 Useful Links:"
echo "================"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• Your App: https://www.wazgine.com"
echo "• NextAuth Test: https://www.wazgine.com/api/auth/providers"
echo "• Debug Endpoint: $DEBUG_URL"
