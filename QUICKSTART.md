# Quick Start Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env
   ```
   
   Then generate a secret for NextAuth:
   ```bash
   # On Windows PowerShell:
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   
   # Or use any random string generator
   ```
   
   Update `.env`:
   ```
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Visit: http://localhost:3000

## Admin Access

- Navigate to: http://localhost:3000/admin/login
- Email: `admin@rccgsigns.com`
- Password: `admin123`

## Next Steps

### Update Church Content

1. **Home Page** - Edit `app/page.tsx`
2. **About Page** - Edit `app/about/page.tsx`
3. **Contact Page** - Edit `app/contact/page.tsx`
4. **Sermons** - Edit `app/sermons/page.tsx`

### Add Images

Place images in `public/images/` directory:
- Church logo
- Hero background
- Service photos
- Ministry photos

### Change Admin Credentials

Edit `lib/auth.ts` and update:
- Admin email
- Admin password (use hashed password in production)

### Enable Database (Optional)

1. Uncomment `prisma/schema.prisma`
2. Uncomment `lib/prisma.ts`
3. Run:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Customize Styling

Edit `tailwind.config.js` to change:
- Color scheme
- Fonts
- Spacing

### Deploy to Production

**Recommended: Vercel**

1. Push code to GitHub
2. Import to Vercel
3. Set environment variables:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your domain)
4. Deploy!

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands (when database is enabled)
npx prisma generate
npx prisma db push
npx prisma studio
```

## Troubleshooting

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
The project will show some TypeScript errors until dependencies are installed. Run `npm install` first.

### Port Already in Use
```bash
# Kill process on port 3000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use a different port
npm run dev -- -p 3001
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

Need help? Contact the development team.
