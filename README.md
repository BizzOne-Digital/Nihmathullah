# SierraLink Executive Transportation LLC

Production-quality lead-generation and booking platform for **SierraLink Executive Transportation LLC** — private airport, executive, corporate, local, and long-distance transportation in Albany and New York's Capital Region.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **MongoDB/Mongoose**, **GSAP + Lenis** cinematic motion, **Stripe Checkout** (optional), and a full **admin CMS/operations portal**.

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+
- **MongoDB** 6+ running locally or a remote URI
- **MongoDB Compass** (optional, for inspecting `sierralink_transportation`)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set AUTH_SECRET (32+ chars) and change ADMIN_PASSWORD before production

# 3. Generate demo placeholder images (SVG)
node scripts/generate-demo-images.mjs

# 4. Start MongoDB, then seed the database
npm run seed

# 5. Development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default credentials (from `.env.example`):
- Email: `info@sierralinkexecutivetransportation.com`
- Password: `change-this-before-production`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript strict check |
| `npm run seed` | Idempotent database seed |
| `node scripts/generate-demo-images.mjs` | Generate branded SVG demo placeholders |

---

## Public Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with cinematic intro |
| `/about` | Company overview |
| `/services` | Service listing |
| `/services/[slug]` | Dynamic service detail (7 seeded services) |
| `/fleet` | Vehicle showcase |
| `/service-areas` | Capital Region coverage |
| `/service-areas/[slug]` | Dynamic area pages (when published) |
| `/gallery` | Photo gallery with lightbox |
| `/testimonials` | Customer testimonials (hidden when none published) |
| `/faqs` | Searchable FAQ accordion |
| `/booking` | Multi-step booking/quote form |
| `/booking/quote/[token]` | Secure customer quote & payment |
| `/booking/payment-success` | Post-Stripe confirmation |
| `/contact` | Contact & inquiry form |
| `/blog` | News/blog index |
| `/blog/[slug]` | Blog post detail |
| `/privacy-policy` | Privacy policy (legal review required) |
| `/terms` | Terms & booking policy (legal review required) |

---

## Admin Routes

Protected at `/admin/*` — login required.

Dashboard, Pages, Services, Service Areas, Fleet, Gallery, Testimonials, FAQs, Pricing, Blog, Bookings, Quotes, Payments, Inquiries, Settings.

---

## Logo & Brand Assets

The client-supplied SierraLink logo (shield with **SL** monogram) is at:

```
public/uploads/settings/sierralink-logo.png
```

Replace via **Admin → Settings** upload. The cinematic intro, header, and footer all use this asset.

**Brand palette:** Obsidian `#060807`, Antique Gold `#AC9461`, Signature Gold `#D0AF6F`, Ivory `#F5EFE5`

---

## Local Media Uploads

All media is stored locally under `public/uploads/`:

```
public/uploads/
  pages/  services/  service-areas/  fleet/
  gallery/  testimonials/  blogs/  settings/
```

**Deployment note:** Local filesystem uploads require **persistent disk** on your Node/VPS host. Ephemeral serverless filesystems (e.g. default Vercel) will lose uploads on redeploy unless you attach persistent volume storage.

Do **not** use Cloudinary, S3, or other hosted media platforms — local uploads are required by project scope.

**Backup:** Include `public/uploads/` in your deployment backup strategy alongside MongoDB.

---

## Demo Images

Branded SVG placeholders live in `public/images/demo/`. Replace with licensed professional photography before launch:

- Black luxury sedan/SUV exteriors and interiors
- Airport curbside scenes (ALB, JFK)
- Executive pickup moments
- Capital Region travel scenery

Demo fleet and gallery records are seeded **unpublished** until replaced with verified SierraLink photography.

---

## MongoDB

Database name: **`sierralink_transportation`**

View in Compass: connect to `mongodb://127.0.0.1:27017` → select `sierralink_transportation`.

**Backup:**
```bash
mongodump --db sierralink_transportation --out ./backup
```

---

## Stripe Payments (Optional)

When disabled (default), bookings and manual quotes work fully. Customers see: *"Payment link will be provided after your ride is confirmed."*

To enable:

1. Create a [Stripe](https://stripe.com) account
2. Set in `.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   PAYMENTS_ENABLED=true
   ```
3. Configure webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Enable payments in **Admin → Pricing**

**Flow:** Admin creates quote on booking → generates secure link → customer accepts → Stripe Checkout (amount from DB, never client) → webhook confirms payment.

Admin **cannot** manually mark a payment as Paid — status comes from verified Stripe webhooks only.

---

## Email (Optional)

Set SMTP credentials in `.env` to send quote/payment links by email. When unavailable, copy links from **Admin → Bookings → [id]**.

The app never claims an email was sent unless delivery actually succeeded.

---

## Google Maps Autocomplete (Optional)

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable address autocomplete. Booking works with plain text fields when disabled.

---

## Google Search Console & Local SEO

1. Deploy site and verify domain in [Google Search Console](https://search.google.com/search-console)
2. Submit sitemap: `https://yourdomain.com/sitemap.xml`
3. Test structured data: [Rich Results Test](https://search.google.com/test/rich-results)
4. **Google Business Profile** (owner must complete):
   - Correct business name, category (Chauffeur/Limousine service)
   - Phone numbers, service areas, website URL
   - Hours and address only when verified
   - Real photos and genuine reviews

Structured data includes LocalBusiness, Service, BreadcrumbList, and FAQ schema **only with verified fields** — no fake ratings or unverified claims.

---

## Pre-Launch Checklist

- [ ] Replace demo images with licensed photography
- [ ] Upload real fleet photos and publish verified vehicle records
- [ ] Review and publish legal pages (Privacy, Terms)
- [ ] Set strong `AUTH_SECRET` and `ADMIN_PASSWORD`
- [ ] Configure Stripe and/or confirm manual quote workflow
- [ ] Add business address/hours in Settings only when verified
- [ ] Enable operational claims toggles only for verified services
- [ ] Publish real testimonials only after customer approval
- [ ] Configure analytics ID and consent if desired
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Ensure persistent storage for `public/uploads/`
- [ ] Back up MongoDB and uploads

---

## Verified Build Results

```
npm run type-check  → PASS (exit 0)
npm run build       → PASS (exit 0, 76 static/SSG pages)
npm run lint        → PASS (warnings only, no errors)
```

---

## Environment Variables

See `.env.example` for all variables. Never commit real secrets.

---

## Support

**SierraLink Executive Transportation LLC**
- Phone: (518) 290-0675
- Email: info@sierralinkexecutivetransportation.com
- Service Area: Albany & the Capital Region, NY
