# Deploy to Vercel (Next.js)

This file contains a focused Vercel-only deployment guide for this Next.js site.

## Prerequisites
- A GitHub repository with your project pushed
- A Vercel account connected to that GitHub account
- DNS access for your custom domain (optional)
- Production environment values (secrets) ready
- Do NOT commit `.env.local` or any secret files to GitHub

## 1) Push your code to GitHub
If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## 2) Import the project on Vercel
1. Go to https://vercel.com and click **Import Project** → **Import Git Repository**.
2. Select your GitHub repository.
3. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave blank if repo root)
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: leave default

## 3) Add Environment Variables (Vercel Dashboard)
In Project Settings → Environment Variables add these keys (Production & Preview as needed):

- `NEXTAUTH_URL` = `https://your-production-domain` (or `https://your-project.vercel.app`)
- `NEXTAUTH_SECRET` = generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- `NEXTAUTH_ADMIN_EMAIL` = `rccgsignsandwondersjonkoping@yahoo.com`
- `NEXTAUTH_ADMIN_PASSWORD_HASH` = (bcrypt hash of the admin password). Generate locally:
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('Jesusislord2026',10))"
  ```
- `DATABASE_URL` = your production DB connection string (if using a DB)

Notes:
- Paste values directly into the Vercel UI or click **Import .env** and paste key=values.
- Do not store plaintext passwords in repo or in Vercel; store only hashed passwords.

## 4) Database & Migrations
If you use Prisma and a production database (recommended: Postgres via Railway/Supabase/Vercel Postgres):

1. Create the production database on your chosen provider and copy `DATABASE_URL` to Vercel env.
2. Apply migrations on production DB (run from a machine that has access to the DB or in CI):
```bash
# Run this where DATABASE_URL points to your production DB
npx prisma migrate deploy
```
3. Run seed (if you have a seed script):
```bash
npx prisma db seed
```

Common option: run migrations in CI (GitHub Actions) after `build` and before deployment, or run `npx prisma migrate deploy` manually once after provisioning the DB.

## 5) Custom Domain (optional)
1. In Vercel → Project → Domains → Add `rccgsignsandwondersjonkoping.se` and `www.rccgsignsandwondersjonkoping.se`.
2. Add DNS records at your registrar:
   - `www` → CNAME → `cname.vercel-dns.com`
   - Root (@) → A → `76.76.21.21` (or use ALIAS/ANAME if supported)
3. Vercel will verify and provision SSL automatically.

## 6) Deploy
- Click **Deploy** in Vercel (first import) or push a new commit to trigger automatic deployments:
```bash
git add .
git commit -m "Deploy-ready"
git push origin main
```

## 7) Post-deploy checks
- Visit your site URL and verify pages load.
- Test admin login at `/admin/login` using the admin email and password you hashed and stored in Vercel env.
- Check API routes, images, mobile responsiveness.

## 8) Troubleshooting & tips
- If build fails, check Vercel build logs for missing env vars or TypeScript errors.
- If Prisma complains about DB file (SQLite) during build, prefer using a production Postgres DB for Vercel — SQLite files are not suitable for serverless builds.
- If secrets were committed previously, remove them from history (BFG/git-filter-repo) and rotate secrets.

## 9) Security & maintenance
- Keep `.env.local` in your local `.gitignore` (already present).
- Rotate `NEXTAUTH_SECRET` and admin password after initial setup.
- Set up monitoring (Sentry) and regular backups for your DB.

## Quick env template (for Vercel UI)
Copy-paste into Vercel's **Import .env** box (replace placeholders):
```
NEXTAUTH_URL=https://rccgsignsandwondersjonkoping.se
NEXTAUTH_SECRET=<paste-generated-secret>
NEXTAUTH_ADMIN_EMAIL=rccgsignsandwondersjonkoping@yahoo.com
NEXTAUTH_ADMIN_PASSWORD_HASH=<paste-bcrypt-hash>
DATABASE_URL=<your-production-db-connection-string>
```

---

## GitHub Actions — repository secrets (for migrations)
If you enabled the `Prisma Migrate & Seed` workflow, add these repository secrets so the workflow can run migrations and seed the production DB.

Required secrets (GitHub repository → Settings → Secrets → Actions):
- `DATABASE_URL` — your production DB connection string (Postgres recommended)
- `NEXTAUTH_ADMIN_EMAIL` — admin email (same as Vercel)
- `NEXTAUTH_ADMIN_PASSWORD_HASH` — bcrypt hash of the admin password
- `NEXTAUTH_SECRET` — same secret you use in Vercel (optional for seed)

Example using GitHub CLI (replace values):
```bash
# Install GitHub CLI and authenticate first: https://cli.github.com/
gh secret set DATABASE_URL --body "postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/DB_NAME?schema=public"
gh secret set NEXTAUTH_ADMIN_EMAIL --body "rccgsignsandwondersjonkoping@yahoo.com"
gh secret set NEXTAUTH_ADMIN_PASSWORD_HASH --body "$2a$10$WiljrBqaI3SB9R61ha7bl.6/jflj4.t3pzAvpbqVGxRsSay5mXrM2"
gh secret set NEXTAUTH_SECRET --body "0PCKqxe6Sk2lDluCgFVH3R1UsbUITO5BNpkKYBq19SE="
```

Verify the workflow runs after pushing a commit or manually dispatching the workflow in the Actions tab.

Notes:
- Keep secrets consistent between Vercel and GitHub if both need them.
- Do NOT commit secrets to the repo. Rotate secrets if accidentally exposed.

If you want, I can add a short GitHub Action to run `npx prisma migrate deploy` on deploy, or prepare the exact DNS records formatted for your registrar. Which would you like next?
