# Go-Live Checklist

Use this checklist before deploying to production.

## Pre-Launch

### ✅ Content Review

- [ ] All church information is accurate
- [ ] Contact details are correct
  - [ ] Address: Havsörnsgatan 111, Råslätt, Jönköping Sweden
  - [ ] Phone: 0727677358, 0739781777
  - [ ] Service times verified
- [ ] About page content reviewed
- [ ] Mission statement approved
- [ ] Sermons/media content ready
- [ ] Events and testimonies up to date
- [ ] Ministries information complete

### ✅ Images

- [ ] Church logo added to `public/images/`
- [ ] Hero background image added
- [ ] Service photos added
- [ ] Ministry photos added
- [ ] All images optimized (< 200KB each)
- [ ] Images have appropriate alt text

### ✅ Security

- [ ] Admin password changed from default
- [ ] Strong admin password set (min 16 characters)
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] Environment variables configured
- [ ] `.env` file NOT committed to git
- [ ] Admin email updated

### ✅ Functionality

- [ ] All pages load without errors
- [ ] Navigation links work
- [ ] Mobile menu functions properly
- [ ] Admin login works
- [ ] Admin logout works
- [ ] API routes respond correctly
- [ ] Contact form ready (if implemented)

### ✅ Design & Responsiveness

- [ ] Desktop layout looks good (1920px+)
- [ ] Laptop layout verified (1366px)
- [ ] Tablet layout verified (768px)
- [ ] Mobile layout verified (375px)
- [ ] All text is readable
- [ ] Colors match church branding
- [ ] Font sizes appropriate

### ✅ SEO & Meta

- [ ] Page titles are descriptive
- [ ] Meta descriptions added
- [ ] Open Graph tags set
- [ ] Favicon added
- [ ] Sitemap prepared (optional)
- [ ] robots.txt configured (optional)

### ✅ Performance

- [ ] Images optimized
- [ ] No console errors in browser
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 80
- [ ] No broken links

### ✅ Technical

- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Dependencies updated
- [ ] Security audit passed (`npm audit`)
- [ ] Git repository initialized
- [ ] Code committed to GitHub

## Deployment

### ✅ Hosting Setup

- [ ] Hosting platform chosen (Vercel/Netlify/etc)
- [ ] Repository connected
- [ ] Build settings configured
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `.next`
- [ ] Environment variables added
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### ✅ DNS Configuration

- [ ] Domain purchased (if using custom domain)
- [ ] DNS records added
  - [ ] A record for root domain
  - [ ] CNAME for www subdomain
- [ ] DNS propagation verified
- [ ] HTTPS working

### ✅ Post-Deployment

- [ ] Production site loads correctly
- [ ] All pages accessible
- [ ] Admin login works in production
- [ ] API routes working
- [ ] Images loading
- [ ] Mobile site tested
- [ ] Different browsers tested
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

## Launch Day

### ✅ Final Checks

- [ ] Test all links one more time
- [ ] Clear browser cache and test
- [ ] Test on mobile device
- [ ] Admin can log in
- [ ] Contact information displays correctly

### ✅ Communication

- [ ] Announce new website to congregation
- [ ] Share on social media
- [ ] Update church business cards
- [ ] Update Google My Business
- [ ] Email members with new URL

### ✅ Monitoring

- [ ] Set up uptime monitoring
- [ ] Configure error tracking (optional)
- [ ] Enable analytics (optional)
- [ ] Check email notifications working

## Post-Launch (Week 1)

### ✅ Maintenance

- [ ] Monitor for errors
- [ ] Check analytics
- [ ] Respond to feedback
- [ ] Fix any reported bugs
- [ ] Update content as needed

### ✅ Optimization

- [ ] Review page load times
- [ ] Optimize slow pages
- [ ] Add more content
- [ ] Improve SEO
- [ ] Submit to search engines

## Monthly Tasks

- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Add new sermons
- [ ] Update events
- [ ] Check uptime statistics
- [ ] Review and respond to analytics
- [ ] Backup database (when enabled)

## Support Contacts

**Technical Issues:**
- Hosting Platform Support
- Development Team Contact

**Content Updates:**
- Church Administrator
- Ministry Leaders

**Emergency:**
- Web Administrator: [email]
- Backup Contact: [email]

---

## Quick Reference

### Admin Access
- URL: `https://your-domain.com/admin/login`
- Email: [Your Admin Email]
- Password: [Your Secure Password]

### Hosting Dashboard
- Platform: [Vercel/Netlify/etc]
- URL: [Dashboard URL]

### Repository
- GitHub: [Repository URL]

### Domain Registrar
- Provider: [Domain Provider]
- Login: [Access Details]

---

**Ready to Launch?**

✅ All checkboxes completed
✅ Team notified
✅ Backup plan ready

**Go Live! 🚀**

---

*Print this checklist or keep it handy for reference.*
