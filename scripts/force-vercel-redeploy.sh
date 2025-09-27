
#!/bin/bash

echo "🚀 Forcing Vercel Redeploy to Fix Skew Protection Issue"
echo "=================================================="

# Create timestamp file to force a new deployment
TIMESTAMP=$(date +%s)
echo "# Force redeploy timestamp: $TIMESTAMP" > FORCE_REDEPLOY_$TIMESTAMP.txt

# Add the file to git
git add FORCE_REDEPLOY_$TIMESTAMP.txt

# Commit with timestamp
git commit -m "Force redeploy to fix Vercel Skew Protection - $TIMESTAMP"

# Push to trigger Vercel deployment
echo "📤 Pushing to git to trigger Vercel deployment..."
git push

echo ""
echo "✅ Git push complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Wait for Vercel deployment to complete (2-3 minutes)"
echo "2. Check debug endpoint: https://www.wazgine.com/api/debug/database?admin=debug_waz_2024"
echo "3. Test admin login: admin@waz.com / admin123"
echo "4. If it still doesn't work, go to Vercel Dashboard and:"
echo "   - Go to Deployments → Redeploy with 'Clear Build Cache'"
echo "   - Or disable Skew Protection in Settings → Functions"
echo ""
echo "🔍 Monitor deployment at: https://vercel.com/dashboard"
