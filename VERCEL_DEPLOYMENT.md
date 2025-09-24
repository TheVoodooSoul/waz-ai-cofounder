
# 🚀 Vercel Deployment Guide for Waz AI Co-Founder Platform

## 🔐 Security-First Deployment

### Step 1: Environment Variables Setup
In your Vercel project dashboard, add these environment variables:

```
NEXTAUTH_SECRET=I/PWopSvXlQHlFvoQrKAOP47HgKCL98tfGMgh6QJw9o=
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=your_production_postgres_url
ABACUSAI_API_KEY=your_production_api_key
```

### Step 2: Production Database
1. **Recommended:** Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for managed PostgreSQL
2. Create new database with secure credentials
3. Update DATABASE_URL in Vercel environment variables
4. Run: `yarn prisma db push` to create tables in production

### Step 3: Deploy Process
1. **Push to GitHub:** `git push origin main`
2. **Import to Vercel:** Connect your GitHub repository
3. **Add Environment Variables:** Copy from Step 1 above
4. **Deploy:** Vercel will build and deploy automatically

### Step 4: Post-Deployment
1. **Test authentication:** Create account and login
2. **Test AI agents:** Chat with Waz, Pierce, Norman
3. **Verify memory persistence:** Check conversation history
4. **Test payment flow:** If Stripe is integrated

## 🛡️ Security Checklist
- ✅ `.env` files are in `.gitignore`
- ✅ Production secrets are rotated from development
- ✅ Database credentials are production-only
- ✅ NEXTAUTH_URL matches production domain
- ✅ API keys have proper scoping/permissions

## 💰 Ready for Revenue!
Once deployed, your live demo link will be:
`https://your-app-name.vercel.app`

Use this for:
- Strategy session demos ($297 each)
- Social media marketing
- Direct prospect outreach
- Early adopter onboarding

---

## 🆘 Troubleshooting
- **Build fails:** Check environment variables are set correctly
- **Auth not working:** Verify NEXTAUTH_URL matches your domain
- **Database errors:** Ensure DATABASE_URL is accessible from Vercel
- **API errors:** Check ABACUSAI_API_KEY permissions
