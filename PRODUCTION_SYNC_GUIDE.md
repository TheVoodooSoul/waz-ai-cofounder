
# Production Environment Sync Guide

## Issue
Your admin login works locally but fails on the live Vercel site. This suggests Vercel is using different environment variables than your local setup.

## Solution Steps

### Step 1: Verify Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `waz_ai_cofounder` project
3. Go to **Settings** → **Environment Variables**

### Step 2: Configure Required Environment Variables in Vercel

You need to set these environment variables in Vercel (exactly as they are in your local `.env`):

```bash
# Database Connection
DATABASE_URL=postgresql://role_62a07af3e:Ku_h__fm9ASr0sveQRvf0PZiAJvNWZ2D@db-62a07af3e.db002.hosteddb.reai.io:5432/62a07af3e?connect_timeout=15

# Authentication
NEXTAUTH_SECRET=I/PWopSvXlQHlFvoQrKAOP47HgKCL98tfGMgh6QJw9o=
NEXTAUTH_URL=https://wazgine.com

# API Keys
ABACUSAI_API_KEY=e758c6ac22e24547b275c82ad45910da
```

**Important Notes:**
- Set `NEXTAUTH_URL` to your production domain: `https://wazgine.com`
- Make sure `DATABASE_URL` is exactly the same as your local version
- All other variables should match your local `.env` file

### Step 3: Redeploy Your Application

After updating the environment variables:

1. Go to your Vercel project dashboard
2. Click on **Deployments** tab
3. Find the latest deployment and click **Redeploy**
4. Or push a new commit to trigger automatic redeployment

### Step 4: Verify Production Database

After redeployment, test the admin login:

**Admin Credentials:**
- Email: `admin@waz.com`
- Password: `admin123`

### Step 5: If Login Still Fails

If the login still doesn't work, there might be a database connection issue. You can:

1. **Check Vercel Function Logs:**
   - Go to your Vercel project dashboard
   - Click on **Functions** tab
   - Check the logs for any database connection errors

2. **Verify Database Access:**
   - The database should be accessible from Vercel's infrastructure
   - Check if there are any firewall restrictions

### Alternative: Use Different Database for Production

If you want to use a separate production database:

1. Create a new database (same provider or different)
2. Update the `DATABASE_URL` in Vercel to point to the new database
3. Run the database migration and seeding:

```bash
# In your local terminal, set the production DATABASE_URL temporarily
export DATABASE_URL="your_production_database_url"
npx prisma db push
npx tsx scripts/verify-production-db.ts
```

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Set:** Make sure all required env vars are set in Vercel
2. **Wrong NEXTAUTH_URL:** Must be your production domain, not localhost
3. **Database Connection:** Verify the database is accessible from Vercel's servers
4. **Case Sensitivity:** Environment variable names are case-sensitive

### Debug Steps:

1. Check Vercel function logs for specific error messages
2. Verify all environment variables are set correctly
3. Test database connection from a temporary API endpoint
4. Ensure no typos in the DATABASE_URL

## Current Database Status

✅ **Local Database (Confirmed Working):**
- Admin user exists: `admin@waz.com`
- Password is valid: `admin123`
- User has admin privileges: `isAdmin: true, planType: ADMIN`
- Database connection: Successful
- Total users: 6

The issue is purely with environment variable configuration in production.
