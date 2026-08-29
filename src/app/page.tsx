import type { Metadata } from "next";
import Link from "next/link";
import CountrySearch from "@/components/CountrySearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";
import SalaryTicker from "@/components/SalaryTicker";
import {
  getCountries,
  getCategories,
  getCurrentYear,
  CURRENT_YEAR,
  getCountryJobs,
  type CountryJobs,
} from "@/lib/db";
import { toUSD, formatAnnual } from "@/lib/salary";
import { iconFor } from "@/lib/category-icons";
import { faqPageSchema } from "@/lib/schema";
import posts from "@/data/blog-posts.json";

const homeTitle = `Best Paying Jobs in Every Country ${CURRENT_YEAR} | BestPayingJobs.net`;
const homeTitleShort = `Best Paying Jobs in Every Country ${CURRENT_YEAR}`;
const homeDesc = `Discover the highest paying jobs in every country. Compare salaries across 30+ career categories including AI, Finance, IT, Healthcare, Engineering and more. Updated for ${CURRENT_YEAR}.`;
const homeDescShort = `Discover the highest paying jobs in every country. Compare salaries across 30+ career categories. Updated for ${CURRENT_YEAR}.`;

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDesc,
  keywords: [
    "best paying jobs",
    "highest salary jobs",
    "salary by country",
    "jobs by country",
    "global salary comparison",
    "high paying careers",
    "career salary guide",
  ],
  alternates: {
    canonical: "https://www.bestpayingjobs.net",
  },
  openGraph: {
    title: homeTitleShort,
    description: homeDesc,
    url: "https://www.bestpayingjobs.net",
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 750,
        alt: "Best Paying Jobs in Every Country",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitleShort,
    description: homeDescShort,
    images: ["/og/default.webp"],
  },
};

// Medal colours are literal on purpose — gold/silver/bronze shouldn't shift with the theme.
const RANK_STYLES = [
  "bg-gradient-to-br from-[#fcd34d] to-[#d9a406] text-[#4a3505]",
  "bg-gradient-to-br from-[#eaeff4] to-[#aeb9c5] text-[#3d4752]",
  "bg-gradient-to-br from-[#e3ac7f] to-[#a4632a] text-white",
];

export default function Home() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();

  const countryJobs = countries
    .map((c) => ({ country: c, data: getCountryJobs(c.code) }))
    .filter((x): x is { country: (typeof countries)[number]; data: CountryJobs } => x.data !== undefined);

  const totalJobs = countryJobs.reduce((sum, { data }) => {
    return sum + Object.values(data.jobs).flat().length;
  }, 0);

  // Every category carries the same role count in every country, so a raw job
  // count is identical across all 31 cards. The top salary actually varies.
  const catStats: Record<string, { countryCount: number; jobCount: number; topUSD: number }> = {};
  for (const cat of categories) {
    catStats[cat.slug] = { countryCount: 0, jobCount: 0, topUSD: 0 };
  }
  for (const { data } of countryJobs) {
    for (const [slug, jobs] of Object.entries(data.jobs)) {
      const stat = catStats[slug];
      if (!stat) continue;
      stat.countryCount++;
      stat.jobCount += jobs.length;
      for (const job of jobs) {
        const usd = toUSD(job.salaryMax, data.currency);
        if (usd > stat.topUSD) stat.topUSD = usd;
      }
    }
  }

  const titleMap: Record<string, { salaries: number[]; countryCount: number }> = {};
  for (const { data } of countryJobs) {
    for (const jobs of Object.values(data.jobs)) {
      for (const job of jobs) {
        const usd = toUSD(job.salaryMax, data.currency);
        if (!titleMap[job.title]) titleMap[job.title] = { salaries: [], countryCount: 0 };
        titleMap[job.title].salaries.push(usd);
      }
    }
  }
  const globalTopJobs = Object.entries(titleMap)
    .map(([title, info]) => ({
      title,
      avgUSD: Math.round(info.salaries.reduce((a, b) => a + b, 0) / info.salaries.length),
      maxUSD: Math.round(Math.max(...info.salaries)),
    }))
    .sort((a, b) => b.avgUSD - a.avgUSD)
    .slice(0, 12);

  // Normalises the meter bars against the highest earner on the board.
  const topAvg = globalTopJobs[0]?.avgUSD ?? 1;

  const topCountries = countryJobs
    .map(({ country, data }) => {
      const salaries = Object.values(data.jobs).flat().map((j) => toUSD(j.salaryMax, data.currency));
      return {
        ...country,
        avgUSD: Math.round(salaries.reduce((a, b) => a + b, 0) / (salaries.length || 1)),
      };
    })
    .sort((a, b) => b.avgUSD - a.avgUSD)
    .slice(0, 5);

  const tickerItems = globalTopJobs.slice(0, 10).map((j) => ({
    title: j.title,
    value: formatAnnual(j.avgUSD),
  }));

  const blogPosts = (posts as typeof posts).slice(0, 3);

  const siteUrl = "https://www.bestpayingjobs.net";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best Paying Jobs in Every Country ${year}`,
    description: `Discover the highest paying careers in ${countries.length} countries across ${categories.length} career categories.`,
    url: siteUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: countries.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/best-paying-jobs-in-${c.slug}`,
        name: `Best Paying Jobs in ${c.name}`,
      })),
    },
  };

  const topJob = globalTopJobs[0];
  const homeFaqs = [
    {
      q: "What is the highest paying job in the world?",
      a: topJob
        ? `Based on salary data from ${countries.length} countries, ${topJob.title} is the highest paying job worldwide, with a global average of ${formatAnnual(topJob.avgUSD)}. Specialist surgeons, senior executives and quantitative finance roles consistently occupy the top of the distribution.`
        : "Specialist medical, senior executive and quantitative finance roles consistently occupy the top of the global salary distribution.",
    },
    {
      q: "Which country pays the highest salaries?",
      a: `${topCountries[0]?.name ?? "Switzerland"} leads on average pay across the roles we track, followed by ${topCountries
        .slice(1, 4)
        .map((c) => c.name)
        .join(", ")}. Small, wealthy economies with concentrated high-value industries typically rank highest, though living costs there are also among the world's steepest.`,
    },
    {
      q: "How do I compare salaries between two countries?",
      a: "Compare take-home pay after local income tax and social contributions, then subtract realistic housing costs for the specific city rather than the national average. Finally, add the value of anything the state provides that you would otherwise buy privately, such as healthcare or childcare. Gross salaries alone are a poor guide.",
    },
    {
      q: "Where does this salary data come from?",
      a: "Figures are based on published research from the Economic Research Institute (ERI) and SalaryExpert, combined with cost-of-living indices and currency exchange rates. All numbers are estimates and vary with experience, employer, sector and location.",
    },
    {
      q: "Is BestPayingJobs.net free to use?",
      a: `Yes. Every page, including all ${countries.length} country guides and the salary calculators, is free and requires no account. The site is supported by advertising.`,
    },
  ];

  const faqSchema = faqPageSchema(homeFaqs);

  const categoryListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Career Categories",
    description: `Browse highest paying jobs by career category across ${countries.length} countries.`,
    itemListElement: categories.map((cat, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cat.name,
      description: cat.description,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0 text-chalk/60 bg-grid mask-fade pointer-events-none" />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[52rem] h-[52rem] rounded-full pointer-events-none opacity-70"
          style={{
            background:
              "radial-gradient(circle, oklch(0.741 0.156 162 / 0.22), transparent 62%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center animate-rise">
            <div className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full bg-chalk/10 border border-chalk/15 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-jade/20 text-jade text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-jade animate-[pulse-dot_2.2s_ease-in-out_infinite]" />
                Live
              </span>
              <span className="text-xs font-medium text-chalk/75">
                {year} data · {countries.length} countries · {totalJobs.toLocaleString()} salaries
              </span>
            </div>

            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem] font-extrabold text-chalk">
              Find what you&rsquo;re
              <br className="hidden sm:block" />{" "}
              <span className="relative inline-block">
                <span className="text-gradient">actually worth</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-jade/50"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 9C40 3 70 2.5 108 5.5C140 8 168 8.5 198 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-8 text-lg text-chalk/65 max-w-xl mx-auto leading-relaxed">
              Real salary ranges for {categories.length} career fields in {countries.length}{" "}
              countries &mdash; so your next move is priced before you make it.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto text-left">
              <CountrySearch />
              <Link
                href="#countries"
                className="inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-xl bg-jade text-ink font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-jade/25 shrink-0"
              >
                Browse all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-chalk/45">
              <span className="font-medium text-chalk/60">Trending:</span>
              {topCountries.map((c) => (
                <Link
                  key={c.code}
                  href={`/best-paying-jobs-in/${c.slug}/`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-chalk/12 hover:border-jade/50 hover:text-chalk transition-colors"
                >
                  <FlagImage slug={c.slug} name={c.name} className="w-3.5 h-3.5 ring-1 ring-chalk/25" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <SalaryTicker items={tickerItems} />
      </section>

      {/* ──────────────── Highest paying jobs worldwide ──────────────── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                The global leaderboard
              </span>
              <h2 className="mt-2.5 text-3xl sm:text-4xl font-bold text-gray-900">
                Highest paying jobs worldwide
              </h2>
              <p className="mt-3 text-gray-500 leading-relaxed">
                Ranked by average salary across all {countries.length} countries, converted to USD.
              </p>
            </div>
            <Link
              href="/global-ranking/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors shrink-0"
            >
              See full ranking
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="card rim overflow-hidden">
            <div className="hidden sm:grid grid-cols-[3.5rem_1fr_9rem_7rem] gap-4 px-5 py-3 border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <span>Rank</span>
              <span>Role</span>
              <span className="text-right">Global average</span>
              <span className="text-right">Top end</span>
            </div>

            <ol className="divide-y divide-gray-100">
              {globalTopJobs.map((job, i) => (
                <li
                  key={job.title}
                  className="group grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3.5rem_1fr_9rem_7rem] items-center gap-x-4 gap-y-2 px-4 sm:px-5 py-3.5 hover:bg-emerald-50/50 transition-colors"
                >
                  <span
                    className={`w-9 h-9 rounded-xl grid place-items-center text-[13px] font-extrabold shadow-sm ${
                      RANK_STYLES[i] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {job.title}
                    </p>
                    <div className="meter mt-2 max-w-xs">
                      <span style={{ width: `${Math.round((job.avgUSD / topAvg) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="col-start-2 sm:col-start-3 flex items-baseline gap-2 sm:block sm:text-right">
                    <span className="sm:hidden text-xs text-gray-400">Avg</span>
                    <span className="numeric text-[15px] font-bold text-emerald-600">
                      {formatAnnual(job.avgUSD)}
                    </span>
                  </div>

                  <div className="col-start-2 sm:col-start-4 flex items-baseline gap-2 sm:block sm:text-right">
                    <span className="sm:hidden text-xs text-gray-400">Top</span>
                    <span className="numeric text-sm font-semibold text-gray-500">
                      {formatAnnual(job.maxUSD)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────────────── Categories ───────────────────── */}
      <section className="py-20 lg:py-24 bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {categories.length} career fields
            </span>
            <h2 className="mt-2.5 text-3xl sm:text-4xl font-bold text-gray-900">
              Browse by category
            </h2>
            <p className="mt-3 text-gray-500 leading-relaxed">
              From AI research to skilled trades &mdash; every field, priced in every country.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const topUSD = catStats[cat.slug]?.topUSD ?? 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/jobs/${cat.slug}/`}
                  className="card card-lift group p-4 sm:p-5 flex flex-col"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                    <svg
                      className="w-[19px] h-[19px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {iconFor(cat.slug).map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </svg>
                  </span>

                  <span className="mt-3.5 text-sm font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </span>
                  <span className="mt-auto pt-3 text-[11px] font-medium text-gray-400">
                    up to{" "}
                    <span className="numeric font-bold text-emerald-600">{formatAnnual(topUSD)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── Countries ───────────────────── */}
      <section id="countries" className="py-20 lg:py-24 bg-white scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Worldwide coverage
            </span>
            <h2 className="mt-2.5 text-3xl sm:text-4xl font-bold text-gray-900">
              All {countries.length} countries
            </h2>
            <p className="mt-3 text-gray-500 leading-relaxed">
              Pick a country for its highest paying roles, salary ranges and cost-of-living context.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {countries.map((c) => {
              const cd = countryJobs.find((x) => x.country.code === c.code);
              const jobCount = cd ? Object.values(cd.data.jobs).flat().length : 0;
              return (
                <Link
                  key={c.code}
                  href={`/best-paying-jobs-in/${c.slug}/`}
                  className="card card-lift group flex items-center gap-3 px-3 py-3"
                >
                  <FlagImage
                    slug={c.slug}
                    name={c.name}
                    className="w-8 h-8 shrink-0 ring-1 ring-gray-200 group-hover:ring-emerald-300 transition-all"
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {c.name}
                    </span>
                    <span className="block numeric text-[11px] text-gray-400">{jobCount} jobs</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── Blog ───────────────────── */}
      <section className="py-20 lg:py-24 bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Career guides
              </span>
              <h2 className="mt-2.5 text-3xl sm:text-4xl font-bold text-gray-900">
                Get paid more, sooner
              </h2>
            </div>
            <Link
              href="/blog/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors shrink-0"
            >
              All articles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}/`} className="card card-lift group p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[11px] text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2.5 text-sm text-gray-500 leading-relaxed line-clamp-3">{post.summary}</p>
                <span className="mt-5 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Read guide &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── CTA + stats ───────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0 text-chalk/50 bg-dots mask-fade pointer-events-none" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[46rem] h-[26rem] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, oklch(0.741 0.156 162 / 0.18), transparent 65%)" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-24 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chalk leading-tight">
            Know your worth,
            <br className="hidden sm:block" /> anywhere in the world
          </h2>
          <p className="mt-5 text-chalk/60 max-w-lg mx-auto leading-relaxed">
            Free, no sign-up, and updated for {year}. Start with your country or compare a role globally.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="#countries"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-jade text-ink font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-jade/20"
            >
              Explore countries
            </Link>
            <Link
              href="/calculator/"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-chalk/20 text-chalk font-semibold text-sm hover:bg-chalk/10 transition-colors"
            >
              Salary calculators
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-8 pt-10 border-t border-chalk/10">
            {[
              { label: "Countries", value: countries.length.toString() },
              { label: "Career fields", value: categories.length.toString() },
              { label: "Salary data points", value: `${totalJobs.toLocaleString()}+` },
              { label: "Last updated", value: year.toString() },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="numeric text-3xl lg:text-4xl font-bold text-chalk">{s.value}</dd>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-chalk/45">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────────────── FAQ ───────────────────── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Common questions
            </span>
            <h2 className="mt-2.5 text-3xl sm:text-4xl font-bold text-gray-900">
              Salary questions, answered
            </h2>
          </div>

          <div className="space-y-3">
            {homeFaqs.map((f) => (
              <details key={f.q} className="group card p-5 open:bg-emerald-50/30">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[16px] font-semibold text-gray-900">
                  {f.q}
                  <svg className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Salary data is based on research from the{" "}
            <a href="https://www.erieri.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Economic Research Institute (ERI)
            </a>{" "}
            and{" "}
            <a href="https://www.salaryexpert.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              SalaryExpert
            </a>
            . Figures are estimates and vary with experience, location and industry.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
