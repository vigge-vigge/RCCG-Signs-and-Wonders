# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### ❌ `npm install` fails

**Symptoms:**
- Error messages during installation
- Missing dependencies
- Installation hangs

**Solutions:**

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use specific Node version**
   - Requires Node.js 18 or higher
   - Check version: `node --version`
   - Update if needed

3. **Try different package manager**
   ```bash
   # Using Yarn
   yarn install
   
   # Using pnpm
   pnpm install
   ```

---

### ❌ TypeScript errors after installation

**Symptoms:**
- Red squiggly lines everywhere
- "Cannot find module" errors
- Type errors

**Solutions:**

1. **Install dependencies first**
   ```bash
   npm install
   ```

2. **Restart VS Code**
   - Close and reopen VS Code
   - Or: Cmd/Ctrl + Shift + P → "Reload Window"

3. **Check TypeScript server**
   - VS Code: Click TypeScript version in status bar
   - Select "Select TypeScript Version" → "Use Workspace Version"

---

## Development Server Issues

### ❌ Port 3000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill process on port 3000 (Windows PowerShell)**
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
   ```

2. **Use different port**
   ```bash
   npm run dev -- -p 3001
   ```

3. **Find and close other dev server**
   - Check for other terminal windows
   - Close duplicate Next.js instances

---

### ❌ Changes not reflecting in browser

**Symptoms:**
- Made code changes but page looks the same
- Old content still showing

**Solutions:**

1. **Hard refresh browser**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

2. **Clear Next.js cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check correct file**
   - Verify you're editing the right file
   - Check file path in error messages

---

## Authentication Issues

### ❌ Cannot log in to admin

**Symptoms:**
- "Invalid credentials" error
- Login page redirects back
- Infinite loading

**Solutions:**

1. **Check credentials**
   - Email: `admin@rccgsigns.com`
   - Password: `admin123` (default)

2. **Verify environment variables**
   ```bash
   # Check .env file exists
   ls .env
   
   # Should contain:
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Regenerate NEXTAUTH_SECRET**
   ```powershell
   # Windows PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   ```
   Update in `.env` file

4. **Clear cookies**
   - Browser settings → Clear cookies
   - Try incognito/private window

---

### ❌ Session expires immediately

**Symptoms:**
- Logged out right after login
- Dashboard redirects to login

**Solutions:**

1. **Check NEXTAUTH_URL**
   ```
   # .env
   NEXTAUTH_URL=http://localhost:3000  # Must match exactly
   ```

2. **Check browser cookies**
   - Enable cookies in browser
   - Disable cookie blockers
   - Try different browser

---

## Build Issues

### ❌ `npm run build` fails

**Symptoms:**
```
Error: Build failed
```

**Solutions:**

1. **Check for TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```
   Fix all errors shown

2. **Clear cache and rebuild**
   ```bash
   rm -rf .next
   npm run build
   ```

3. **Check environment variables**
   - Ensure `.env` file exists
   - All required variables set

4. **Check syntax errors**
   - Look for missing imports
   - Unclosed tags
   - Missing semicolons

---

### ❌ Image optimization errors

**Symptoms:**
```
Error: Invalid src prop
```

**Solutions:**

1. **Check image path**
   ```tsx
   // Correct
   <Image src="/images/photo.jpg" ... />
   
   // Wrong
   <Image src="images/photo.jpg" ... />
   ```

2. **Verify image exists**
   - Check `public/images/` folder
   - Verify filename spelling

3. **Add remote patterns** (if using external images)
   ```javascript
   // next.config.mjs
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'your-domain.com',
       },
     ],
   }
   ```

---

## Runtime Errors

### ❌ Hydration errors

**Symptoms:**
```
Error: Text content does not match server-rendered HTML
```

**Solutions:**

1. **Remove client-only code from server components**
   ```tsx
   // Add 'use client' to components using useState, useEffect, etc.
   'use client';
   
   import { useState } from 'react';
   ```

2. **Check for dynamic content**
   - Remove `new Date()` from server components
   - Use consistent formatting

3. **Verify no browser-only APIs**
   - No `window` or `document` in server components
   - Wrap in `useEffect` if needed

---

### ❌ API route not found

**Symptoms:**
```
404: This page could not be found
```

**Solutions:**

1. **Check route file location**
   ```
   app/api/sermons/route.ts  ✅
   app/api/sermons.ts        ❌
   ```

2. **Verify export names**
   ```typescript
   // Must export GET, POST, etc.
   export async function GET() { ... }
   ```

3. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## Styling Issues

### ❌ Tailwind classes not working

**Symptoms:**
- No styling applied
- Classes have no effect

**Solutions:**

1. **Check tailwind.config.js**
   ```javascript
   content: [
     './app/**/*.{js,ts,jsx,tsx}',  // Must include your files
   ],
   ```

2. **Import globals.css**
   ```typescript
   // app/layout.tsx
   import './globals.css';
   ```

3. **Rebuild**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### ❌ Custom colors not working

**Symptoms:**
- `text-primary-600` not working
- Custom colors undefined

**Solutions:**

1. **Check tailwind.config.js**
   ```javascript
   theme: {
     extend: {
       colors: {
         primary: { ... },  // Must be defined here
       },
     },
   }
   ```

2. **Restart dev server** after config changes

---

## Database Issues (When Enabled)

### ❌ Prisma client errors

**Symptoms:**
```
Error: PrismaClient is not configured
```

**Solutions:**

1. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

2. **Uncomment Prisma code**
   - `prisma/schema.prisma`
   - `lib/prisma.ts`

3. **Push schema to database**
   ```bash
   npx prisma db push
   ```

---

### ❌ Database connection failed

**Symptoms:**
```
Error: Can't reach database server
```

**Solutions:**

1. **Check DATABASE_URL**
   ```bash
   # .env
   DATABASE_URL="file:./dev.db"
   ```

2. **Verify database exists**
   ```bash
   ls prisma/dev.db
   ```

3. **Create database**
   ```bash
   npx prisma db push
   ```

---

## Deployment Issues

### ❌ Build fails in production

**Symptoms:**
- Vercel/Netlify build errors
- Deployment failed

**Solutions:**

1. **Test build locally**
   ```bash
   npm run build
   npm start
   ```
   Fix all errors

2. **Check environment variables**
   - Set in hosting dashboard
   - Match local .env

3. **Check Node version**
   - Hosting platform uses Node 18+
   - Update if needed

---

### ❌ Admin login doesn't work in production

**Symptoms:**
- Works locally but not in production
- Redirects to login page

**Solutions:**

1. **Update NEXTAUTH_URL**
   ```
   # Production .env
   NEXTAUTH_URL=https://your-actual-domain.com
   ```

2. **Check NEXTAUTH_SECRET**
   - Must be set in production
   - Different from development

3. **Clear browser cache**
   - Or try incognito mode

---

### ❌ Images not loading in production

**Symptoms:**
- Images work locally
- Broken images in production

**Solutions:**

1. **Check image paths**
   ```tsx
   // Use absolute paths
   /images/photo.jpg  ✅
   images/photo.jpg   ❌
   ```

2. **Verify images in repository**
   - Committed to Git
   - In `public/` folder

3. **Check image optimization**
   - Add domain to next.config.mjs
   - For external images

---

## Performance Issues

### ❌ Slow page loads

**Symptoms:**
- Pages take long to load
- Laggy navigation

**Solutions:**

1. **Optimize images**
   - Compress images (< 200KB)
   - Use WebP format
   - Use next/image component

2. **Check bundle size**
   ```bash
   npm run build
   # Look for large bundles
   ```

3. **Enable caching**
   - Add cache headers
   - Use CDN for assets

---

### ❌ Large bundle size

**Symptoms:**
```
Warning: Large page bundles
```

**Solutions:**

1. **Use dynamic imports**
   ```typescript
   const Component = dynamic(() => import('./Component'));
   ```

2. **Remove unused dependencies**
   ```bash
   npm uninstall unused-package
   ```

3. **Check for duplicates**
   ```bash
   npm dedupe
   ```

---

## Browser-Specific Issues

### ❌ Works in Chrome but not Safari

**Solutions:**

1. **Check for unsupported features**
   - Use polyfills if needed
   - Test in multiple browsers

2. **Clear Safari cache**
   - Safari → Preferences → Advanced
   - Show Develop menu
   - Develop → Empty Caches

---

### ❌ Mobile layout broken

**Solutions:**

1. **Test responsive design**
   - Use browser dev tools
   - Test on actual device

2. **Check viewport meta tag**
   ```tsx
   // app/layout.tsx already includes this
   ```

3. **Fix specific breakpoints**
   ```tsx
   // Use Tailwind responsive classes
   <div className="w-full md:w-1/2">
   ```

---

## Getting More Help

### When to Contact Support

Contact the development team if:
- Error persists after trying solutions
- Data loss or corruption
- Security concerns
- Need custom feature

### What to Include

When reporting an issue:
1. **Error message** (full text)
2. **Steps to reproduce**
3. **Browser and OS**
4. **Screenshots** (if applicable)
5. **What you've tried**

### Debug Information

Collect this info:
```bash
# Node version
node --version

# npm version
npm --version

# Check for errors
npm run build 2>&1 | tee build-log.txt
```

---

## Common Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `Module not found` | Missing dependency | `npm install` |
| `Invalid credentials` | Wrong login info | Check email/password |
| `Build failed` | Compilation error | Check TypeScript errors |
| `Hydration mismatch` | Server/client mismatch | Add 'use client' directive |
| `404 Not found` | Page doesn't exist | Check route file location |

---

## Prevention Tips

**Avoid common issues:**

✅ Always run `npm install` after pulling code
✅ Restart dev server after config changes
✅ Clear cache when seeing strange behavior
✅ Test in multiple browsers
✅ Keep dependencies updated
✅ Follow TypeScript recommendations
✅ Use proper file structure
✅ Commit often with clear messages

---

## Still Stuck?

1. **Check documentation**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
2. **Search online**: Stack Overflow, GitHub Issues
3. **Ask community**: Next.js Discord, Reddit
4. **Contact support**: Web administrator email

---

**Remember: Most issues have simple solutions. Stay calm and debug systematically! 🐛🔍**
