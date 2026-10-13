# Alley Properties — Digital Showroom (Growth plan demo)

Next.js 15 + Supabase site for Alley Properties with three categories — **Houses for Sale**, **Serviced Apartments**, **Furnishings** — WhatsApp enquiries on every listing, favourites (heart), Available/Sold tags, and a private admin dashboard.

## Features
- Home, category pages (search + location/price/status filters), listing detail with gallery
- WhatsApp button on every card and listing page (pre-filled message with listing link)
- Favourites saved on the visitor's device + "Saved" page
- Admin (`/admin`): add/edit/delete listings, upload multiple photos, mark sold/available, feature on home, manage categories
- SEO: per-page titles/descriptions, Open Graph, `sitemap.xml`, `robots.txt`, Search Console verification tag
- Google Analytics / Google Ads: WhatsApp clicks are tracked as leads (`generate_lead` + Ads conversion)

## 1. Set up Supabase
1. Create a free project at https://supabase.com.
2. Open **SQL Editor → New query**, paste the whole of `supabase/schema.sql`, click **Run**. This creates tables, security rules, the `listing-images` photo bucket and 12 sample listings.
3. **Authentication → Users → Add user**: create the admin (email + password, tick "Auto confirm").
4. Make that user an admin — in SQL Editor run:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'admin@yourdomain.com';
   ```
5. (Recommended) **Authentication → Sign In / Providers → Email**: turn off "Allow new users to sign up" so only you can create accounts.

## 2. Run locally
```bash
cp .env.example .env.local   # fill in values from Supabase → Project Settings → API
npm install
npm run dev                   # http://localhost:3000
```
Admin: http://localhost:3000/admin

## 3. Push to GitHub
```bash
git init && git add . && git commit -m "Alley Properties site"
git branch -M main
git remote add origin https://github.com/<you>/alley-properties.git
git push -u origin main
```

## 4. Deploy (Vercel recommended)
1. https://vercel.com → **Add New Project** → import the GitHub repo.
2. Add the environment variables from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to your real domain).
3. Deploy, then add your custom domain under **Settings → Domains**.
Also works on Netlify, Render, Railway or any Node host (`npm run build && npm start`).

## Environment variables
| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase connection |
| `NEXT_PUBLIC_SITE_URL` | Your live URL (sitemap, WhatsApp links) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp, digits only, e.g. `2348012345678` |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID (`G-…`) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | Ads conversion (`AW-…` and label) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag code |

## Customise
- Brand colours/fonts: `app/globals.css`, `app/layout.tsx`
- Address, email, hours: `components/Footer.tsx`, `app/contact/page.tsx`
- Home page copy & images: `app/page.tsx`

## Project structure
```
app/            pages (public + /admin), sitemap, robots
components/     UI (cards, WhatsApp, favourites, gallery)
lib/            Supabase clients, types, helpers, tracking
supabase/       schema.sql (run once)
middleware.ts   protects /admin
```
