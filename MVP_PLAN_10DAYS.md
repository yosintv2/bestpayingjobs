# 10-Day MVP + SEO Plan — BestPayingJobs.net

## Tech Stack (Recommended)
| Layer | Choice |
|-------|--------|
| Framework | **Next.js 15 (App Router)** — SSG/ISR for speed, SEO-friendly |
| Deployment | **Cloudflare Pages** (free, global CDN) |
| Styling | **Tailwind CSS v4** — rapid UI |
| Database | **JSON files** (MVP) → later migrate to SQLite/Supabase |
| Charts | **Recharts** or static SVG charts |
| SEO | next-seo, next-sitemap, Schema.org JSON-LD |
| Images | Sharp + `next/image` with Cloudflare Images |

## Data Architecture
```
src/data/
├── countries.json          # 195 countries { code, name, flag, currency }
├── categories.json         # 28 categories (Finance, AI, Healthcare…)
├── jobs/
│   ├── np.json             # Nepal jobs { country, category, rank, title, min, max, reasons }
│   ├── us.json             # USA
│   └── …                   # One file per country
└── blogs.json              # 10 blog posts
```

Generate 20 seed countries for MVP (expand post-launch).

## Country Pages (MVP: 20 countries × 28 categories = 560 pages)
URL pattern: `/{country}/best-paying-jobs` — e.g. `/nepal/best-paying-jobs`

Each country page has 28 category accordions with rank-ordered jobs.

---

# Day-by-Day Schedule

## Day 1 — Foundation & Architecture
- [X] Initialize Next.js 15 with App Router + Tailwind CSS v4
- [X] Set up Cloudflare Pages project (wrangler.toml, `npm run pages:deploy`)
- [X] Create folder structure: `src/app`, `src/data`, `src/components`, `src/lib`
- [X] Build `countries.json` (195 countries: code, name, currency, flag emoji, slug)
- [X] Build `categories.json` (31 categories + "AI & Machine Learning" added)
- [X] Write `src/lib/db.ts` — JSON loader + filter helpers
- [X] Add `next.config.ts` with images, rewrites, trailingSlash
- [X] **SEO**: `robots.txt`, `manifest.json`, global metadata in `layout.tsx`

## Day 2 — Core Data & Homepage
- [X] Build job data files for **all 195 countries** (via regenerate-realistic.mjs)
- [X] Build homepage: hero + year-dynamic headline, featured countries grid, top categories
- [X] **SEO**: `<title>` — "Best Paying Jobs in Every Country (2026) | BestPayingJobs.net"
- [X] **SEO**: `<meta name="description">` — includes countries, salary data
- [X] **SEO**: Open Graph tags (og:title, og:description, og:image, og:url)
- [X] **SEO**: Twitter Card tags

## Day 3 — Country Pages (Core MVP)
- [X] Build `/best-paying-jobs-in/[slug]/page.tsx` — dynamic route for each country
- [X] Show: country flag, name, currency, year, last updated
- [X] Render category sections with rank-ordered job cards
- [X] Each job card: rank, title, salary range (min–max), reason tags
- [X] **SEO**: Per-country `<title>` — e.g., "Best Paying Jobs in Nepal (2026)"
- [X] **SEO**: Per-country `<meta description>` with top 3 jobs
- [ ] **SEO**: `og:image` per country (auto-generated with country name + top jobs)
- [ ] **SEO**: `hreflang` tags for internationalization prep
- [X] **SEO**: `canonical` URL per page

## Day 4 — Category Pages & Salary Charts
- [X] Build `/app/category/[slug]/page.tsx` — jobs across all countries for one category
- [X] Build `/app/category/page.tsx` — category listing page
- [X] Integrate **Recharts** — salary comparison bar charts per category
- [X] Build static SVG chart component for fallback/no-JS
- [X] **SEO**: Category `<title>` — "Best Paying Jobs in Finance (2026) in Every Country"
- [X] **SEO**: Category `<meta description>` with top category jobs
- [X] **SEO**: Breadcrumb structured data (JSON-LD)
- [X] **SEO**: Category sitemap

## Day 5 — AI Jobs Integration (2026 Differentiator)
- [X] Add **"AI & Machine Learning"** category with 15+ AI jobs (category exists in all countries)
- [X] Build `/app/category/ai-machine-learning/page.tsx` as hero category
- [X] Create `/blog/ai-jobs-future-2026` article
- [X] **SEO**: Target keywords — "AI jobs 2026 salary", "highest paying AI jobs", "AI engineer salary"
- [X] **SEO**: FAQ Schema for AI jobs page

## Day 6 — Blog System & Content
- [X] Build `/app/blog/page.tsx` — blog listing
- [X] Build `/app/blog/[slug]/page.tsx` — dynamic blog post route
- [X] Add all blog articles as MDX files (stored as JSON instead for MVP)
- [X] **SEO**: Blog Article schema (Article, NewsArticle)
- [X] **SEO**: Internal linking from country/category pages to relevant blogs
- [X] **SEO**: Blog sitemap (built-in Next.js sitemap via generateStaticParams)
- [X] Migrate category pages from `/category/` to `/jobs/` URL prefix for SEO

## Day 7 — SEO Images, Charts & Watermarks
- [ ] Build **auto-generated feature images** (Sharp/Canvas)
- [ ] Display salary amounts clearly on images
- [ ] Set up `og:image` generation pipeline
- [ ] **SEO**: Image `alt` text, `title` attributes, filenames with hyphens
- [ ] **SEO**: `ImageObject` schema per image

## Day 8 — Comparison Tools & Interactive Features
- [ ] Build **salary comparison tool**: select 2+ countries, compare same category
- [ ] Build **salary calculator**: convert salary to USD/EUR/GBP
- [ ] Add **sort/filter** on country pages (by salary high→low, by category)
- [ ] Add **share buttons** (Twitter, Facebook, WhatsApp, LinkedIn)
- [ ] Build **"Print/Save as PDF"** button per page
- [ ] **SEO**: Internal linking strategy — cross-link country, category, blog pages
- [ ] **SEO**: "Related articles" section on every page

## Day 9 — Performance, Schema & Polish
- [ ] Lighthouse audit — target 95+ on all metrics
- [ ] Lazy-load off-screen images
- [ ] Add `next-sitemap` — generate `sitemap.xml` with all pages
- [X] Add **Schema.org JSON-LD** on every page:
  - [X] `WebSite` schema (homepage)
  - [X] `WebPage` / `CollectionPage` schema (country pages)
  - [X] `BreadcrumbList` (country pages)
  - [X] `Organization` schema (layout)
  - [X] `ItemList` with `JobPosting` items (top 10 + per-category)
  - [ ] `FAQPage` (where applicable)
  - [ ] `Article` (blog posts)
- [ ] Add "Last Updated" dates with ISO 8601 schema markup
- [ ] Responsive testing (mobile, tablet, desktop)

## Day 10 — Deployment, Testing & Launch Prep
- [X] Cloudflare Pages setup (wrangler.toml)
- [X] Create `_redirects` file for Cloudflare Pages (hyphenated URL proxy)
- [ ] Set up custom domain
- [ ] Set up **Google Search Console** + submit sitemap
- [ ] Set up **Google Analytics 4** (or Plausible/Umami)
- [ ] Set up **Bing Webmaster Tools**
- [ ] Test all 195 country pages render correctly
- [ ] Link audit — no broken links
- [ ] Add `Cache-Control` headers for static assets
- [ ] **Launch checklist**: SSL, www redirect, sitemap submitted, Core Web Vitals

---

# SEO Keyword Strategy (Top Priority)

| Keyword Type | Examples | Target URL |
|-------------|----------|------------|
| Money | best paying jobs, highest salary jobs, top paying careers | `/` |
| Country-specific | best paying jobs in Nepal, highest salary jobs in USA | `/{country}` |
| Category-specific | best paying jobs in finance, highest salary IT jobs | `/jobs/{slug}` |
| AI-specific | AI engineer salary 2026, highest paying AI jobs | `/jobs/ai-machine-learning` |
| Blog long-tail | jobs without degree, salary increase email templates | `/blog/{slug}` |

# Content Expansion Post-MVP
- Remaining 175+ countries
- Salary by city pages
- Salary comparison API
- Email newsletter (capture leads)
- Job board integration
- Multilingual support (top 10 languages)
