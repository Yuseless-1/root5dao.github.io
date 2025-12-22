# Quick Setup Guide for External Services

## 🚀 Immediate Actions (FREE)

### 1. Google Search Console (5 minutes)
1. Go to https://search.google.com/search-console
2. Click "Add Property" → Enter `root5dao.github.io`
3. Choose "HTML tag" verification method
4. Copy the verification code
5. Add it to `src/app/layout.tsx` in the `verification.google` field
6. Submit your sitemap: `https://root5dao.github.io/sitemap.xml`

### 2. Google Analytics 4 (5 minutes)
1. Go to https://analytics.google.com/
2. Create a new property (or use existing)
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Create `.env.local` file in project root:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
5. Analytics will automatically start tracking!

### 3. Bing Webmaster Tools (3 minutes)
1. Go to https://www.bing.com/webmasters
2. Add your site: `root5dao.github.io`
3. Verify ownership (HTML tag method)
4. Add verification code to `layout.tsx`
5. Submit sitemap

### 4. Test Your Setup
- **Sitemap**: Visit https://root5dao.github.io/sitemap.xml
- **Robots**: Visit https://root5dao.github.io/robots.txt
- **PageSpeed**: Test at https://pagespeed.web.dev/
- **Mobile-Friendly**: Test at https://search.google.com/test/mobile-friendly
- **Structured Data**: Validate at https://validator.schema.org/

---

## 📊 Optional Services

### Plausible Analytics (Privacy-Friendly)
1. Sign up at https://plausible.io/
2. Add your domain
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=root5dao.github.io
   ```

### Uptime Monitoring
- **UptimeRobot** (Free): https://uptimerobot.com
  - Monitor your site every 5 minutes
  - Get email/SMS alerts when down

---

## ✅ What's Already Configured

✅ **Security Headers** - Added to `next.config.ts`
✅ **Analytics Component** - Ready to use (just add GA ID)
✅ **Sitemap** - Auto-generated at `/sitemap.xml`
✅ **Robots.txt** - Auto-generated at `/robots.txt`
✅ **Structured Data** - Organization schema on homepage
✅ **Open Graph Tags** - For social media sharing
✅ **Twitter Cards** - For Twitter sharing
✅ **Page Metadata** - All pages have proper metadata

---

## 🔍 Testing Checklist

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Google Search Console verified
- [ ] Google Analytics tracking (check in GA dashboard)
- [ ] Bing Webmaster Tools verified
- [ ] PageSpeed score > 80
- [ ] Mobile-friendly test passes
- [ ] Structured data validates
- [ ] Open Graph preview works (test at https://www.opengraph.xyz)

---

## 📝 Next Steps

1. **Create proper OG image** (1200x630px) - Replace `/layers/pfp_base.png` in metadata
2. **Submit to crypto directories**:
   - CoinGecko
   - CoinMarketCap
   - DappRadar
3. **Create content**:
   - Blog posts about your DAO
   - Medium articles
   - Mirror.xyz posts
4. **Build backlinks**:
   - Partner with other DAOs
   - Get featured in crypto news
   - Community partnerships

---

## 🆘 Troubleshooting

**Analytics not working?**
- Check `.env.local` file exists
- Ensure `NEXT_PUBLIC_GA_ID` is set correctly
- Check browser console for errors
- Verify GA4 property is active

**Search Console not verifying?**
- Make sure verification code is in `layout.tsx`
- Wait a few minutes after adding
- Try alternative verification method (DNS)

**Sitemap not found?**
- Run `npm run build` to generate sitemap
- Check Next.js is properly configured
- Verify sitemap.ts file exists

