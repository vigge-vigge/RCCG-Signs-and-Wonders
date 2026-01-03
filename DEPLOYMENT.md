# Deployment Guide

## Pre-Deployment Checklist

- [ ] Update admin credentials in `lib/auth.ts`
- [ ] Add real church images to `public/images/`
- [ ] Update contact information
- [ ] Review all content for accuracy
- [ ] Test all pages locally
- [ ] Set up production environment variables
- [ ] Choose hosting platform

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros**: Free tier, automatic CI/CD, optimized for Next.js
**Best for**: Quick deployment, auto-scaling

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: ./
   
3. **Add Environment Variables**
   - `NEXTAUTH_SECRET`: (generate new secret)
   - `NEXTAUTH_URL`: https://your-domain.vercel.app

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your site!

**Custom Domain:**
- Go to Project Settings → Domains
- Add your custom domain (e.g., rccgsignsandwonders.com)
- Update DNS records as instructed

---

### Option 2: Netlify

**Pros**: Free tier, easy deployment
**Best for**: Static sites with API routes

**Steps:**

1. **Push to GitHub** (same as Vercel)

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Import from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Add Environment Variables**
   - Site Settings → Environment Variables
   - Add same variables as Vercel

4. **Deploy**

---

### Option 3: Railway

**Pros**: Database hosting included, Docker support
**Best for**: Full-stack apps with database

**Steps:**

1. **Push to GitHub**

2. **Deploy to Railway**
   - Visit [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Railway auto-detects Next.js

3. **Environment Variables**
   - Add in Railway dashboard

4. **Database** (optional)
   - Add PostgreSQL service
   - Update `DATABASE_URL` in env vars
   - Enable Prisma in code

---

### Option 4: DigitalOcean App Platform

**Pros**: Predictable pricing, good performance
**Best for**: Production apps

**Steps:**

1. **Push to GitHub**

2. **Create App**
   - Visit [DigitalOcean Apps](https://www.digitalocean.com/products/app-platform)
   - Create app from GitHub
   - Select Next.js

3. **Configure**
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment variables

4. **Deploy**

---

## Production Environment Variables

Create these in your hosting platform:

```bash
# Required
NEXTAUTH_SECRET=<generate-new-secret-32-chars-min>
NEXTAUTH_URL=https://your-production-domain.com

# Optional (if using database)
DATABASE_URL=<your-database-connection-string>
```

**Generate NEXTAUTH_SECRET:**
```bash
# Option 1: OpenSSL (if available)
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

---

## Database Setup (Production)

### Option 1: Railway PostgreSQL

1. Add PostgreSQL to your Railway project
2. Copy `DATABASE_URL` from Railway
3. Add to environment variables
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Vercel Postgres

1. Enable Vercel Postgres in dashboard
2. Connect to your project
3. Run migrations via Vercel CLI

### Option 3: Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string
3. Add to `DATABASE_URL`
4. Run migrations

---

## Custom Domain Setup

### DNS Configuration

Add these DNS records (varies by registrar):

**For Vercel:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

**For Netlify:**
```
Type: CNAME
Name: www
Value: your-site.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

### SSL Certificate

All platforms provide free SSL certificates:
- Vercel: Automatic via Let's Encrypt
- Netlify: Automatic via Let's Encrypt
- Railway: Automatic
- DigitalOcean: Automatic

---

## Post-Deployment

### 1. Test Everything

- [ ] All pages load correctly
- [ ] Admin login works
- [ ] API routes respond
- [ ] Images load properly
- [ ] Contact form (if connected)
- [ ] Mobile responsiveness

### 2. SEO Setup

Add to `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'RCCG Signs and Wonders - Jönköping Sweden',
  description: 'The Redeemed Christian Church of God - Signs and Wonders Parish, Jönköping Sweden',
  keywords: 'church, RCCG, Jönköping, Sweden, Christian, worship',
  openGraph: {
    title: 'RCCG Signs and Wonders',
    description: 'Welcome to our church community',
    url: 'https://your-domain.com',
    siteName: 'RCCG Signs and Wonders',
    images: ['/images/church-exterior.jpg'],
  },
};
```

### 3. Analytics (Optional)

Add Google Analytics:
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`

### 4. Monitoring

Set up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)

---

## Maintenance

### Regular Updates

```bash
# Update dependencies monthly
npm update

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

### Backup Strategy

1. **Code**: Stored in GitHub
2. **Database**: 
   - Railway: Automatic backups
   - Supabase: Point-in-time recovery
   - Manual: Schedule weekly backups

### Content Updates

1. Use admin dashboard for content
2. Or update code and redeploy
3. Test in staging first (create staging branch)

---

## Troubleshooting Production

### Build Fails

Check build logs for:
- Missing environment variables
- TypeScript errors
- Missing dependencies

Solution:
```bash
# Test build locally
npm run build

# Fix errors, then push
```

### Site is Slow

1. Enable Vercel Analytics
2. Check image optimization
3. Add caching headers
4. Consider CDN for images

### Admin Login Not Working

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches domain
3. Clear browser cookies
4. Check browser console for errors

---

## Scaling Considerations

As your site grows:

1. **Database**: Upgrade to production tier
2. **Hosting**: Monitor usage, upgrade plan if needed
3. **CDN**: Add Cloudflare for global performance
4. **Caching**: Implement Redis for session storage
5. **Media**: Use Cloudinary or Uploadcare for images

---

## Support

For deployment help:
- Vercel Discord: [discord.gg/vercel](https://discord.gg/vercel)
- Netlify Support: [answers.netlify.com](https://answers.netlify.com)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

---

**Ready to deploy? Choose your platform and follow the steps above!**
