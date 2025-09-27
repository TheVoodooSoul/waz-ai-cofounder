
# Fix Vercel Skew Protection Issue

## Problem
Your admin login works locally but fails on Vercel due to Skew Protection - where the frontend and backend are out of sync after deployment.

## Solution: Force Complete Redeployment

### Step 1: Verify Debug Endpoint (First)

Before making changes, let's check if the debug endpoint works in production:

1. Go to: `https://www.wazgine.com/api/debug/database?admin=debug_waz_2024`
2. This should show you the current production database state

**Expected Response:**
```json
{
  "status": "success",
  "database": {
    "connected": true,
    "user_count": 6
  },
  "admin_user": {
    "email": "admin@waz.com",
    "isAdmin": true,
    "planType": "ADMIN",
    "hasPassword": true
  },
  "environment": {
    "nextauth_url": "https://www.wazgine.com",
    "has_nextauth_secret": true,
    "node_env": "production"
  }
}
```

If this returns 404 or shows wrong data, we have a deployment sync issue.

### Step 2: Force Clean Redeployment in Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `waz_ai_cofounder` project
3. Go to **Settings** → **General**
4. Scroll down to **Build & Development Settings**
5. Click **Edit** next to Build Command
6. Change it temporarily to: `npm run build && echo "force-rebuild-$(date +%s)"`
7. Click **Save**
8. Go to **Deployments** tab
9. Click **Redeploy** on the latest deployment
10. ✅ **IMPORTANT:** Check "Clear Build Cache and Redeploy"
11. Wait for deployment to complete
12. Test admin login again

#### Option B: Disable Skew Protection

1. In your Vercel project dashboard
2. Go to **Settings** → **Functions**
3. Look for **Skew Protection** setting
4. Set it to **Disabled**
5. Redeploy the project

### Step 3: Verify Environment Variables (Double Check)

Make sure these are EXACTLY set in Vercel:

```env
DATABASE_URL=postgresql://role_62a07af3e:Ku_h__fm9ASr0sveQRvf0PZiAJvNWZ2D@db-62a07af3e.db002.hosteddb.reai.io:5432/62a07af3e?connect_timeout=15
NEXTAUTH_SECRET=I/PWopSvXlQHlFvoQrKAOP47HgKCL98tfGMgh6QJw9o=
NEXTAUTH_URL=https://www.wazgine.com
ABACUSAI_API_KEY=e758c6ac22e24547b275c82ad45910da
```

**Critical:** Make sure `NEXTAUTH_URL` is `https://www.wazgine.com` (not `https://wazgine.com` without www)

### Step 4: Test After Redeployment

1. **Check Debug Endpoint:** `https://www.wazgine.com/api/debug/database?admin=debug_waz_2024`
2. **Test Admin Login:**
   - Email: `admin@waz.com`
   - Password: `admin123`

### Step 5: Check Vercel Function Logs

If login still fails:

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Try to login (so it generates logs)
4. Check the logs for specific errors:
   - "User not found"
   - "Invalid password"
   - Database connection errors
   - NextAuth errors

## Alternative: Git-Based Force Redeploy

If you prefer to trigger via git commit:

1. Run the force redeploy script: `./scripts/force-vercel-redeploy.sh`
2. This will create a timestamp file and push to git
3. Vercel will automatically redeploy

## After Fixing

Once login works, **REMEMBER TO:**

1. Remove the debug endpoint in production (security)
2. Reset the Build Command back to just `npm run build`
3. Re-enable Skew Protection if you disabled it

## Troubleshooting

### Still Getting 404 on Debug Endpoint?
- The API routes aren't deployed properly
- Force a complete rebuild with cache clear

### Environment Variables Not Loading?
- Double-check spelling and values in Vercel
- Make sure they're set for "Production" environment
- Redeploy after changing env vars

### Database Connection Issues?
- Verify DATABASE_URL is exactly correct
- Check if database allows connections from Vercel IPs
- Test the connection string locally first

