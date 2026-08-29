import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCountries,
  getCountryBySlug,
  getCurrentYear,
  hasCountryJobs,
} from "@/lib/db";
import {
  getEarnMoneyMethods,
  getConfig,
} from "@/lib/earn-money-online";
import { seededShuffle } from "@/lib/shuffle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackingRedirect from "@/components/TrackingRedirect";
import ShareButtons from "@/components/ShareButtons";
import FlagImage from "@/components/FlagImage";
import posts from "@/data/blog-posts.json";
import { earnOnlineKeywords } from "@/lib/keywords";

export async function generateStaticParams() {
  const countries = getCountries();
  return countries
    .filter((c) => hasCountryJobs(c.code))
    .map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) return {};
  const year = getCurrentYear();
  const methods = getEarnMoneyMethods(c.code, c.currency);
  const top3 = methods.slice(0, 3).map((m) => m.title).join(", ");
  const cfg = getConfig();

  const resolve = (tpl: string) =>
    tpl
      .replace(/\{country\}/g, c.name)
      .replace(/\{year\}/g, String(year))
      .replace(/\{top3\}/g, top3)
      .replace(/\{currency\}/g, c.currency);

  return {
    title: resolve(cfg.metaTitle),
    description: resolve(cfg.metaDescription),
    keywords: earnOnlineKeywords({ country: c.name, year: getCurrentYear() }),
    alternates: {
      canonical: `https://www.bestpayingjobs.net/earn-money-online/${c.slug}`,
    },
    openGraph: {
      title: resolve(cfg.metaTitle),
      description: resolve(cfg.metaDescription),
    },
    twitter: {
      card: "summary_large_image",
      title: resolve(cfg.metaTitle),
      description: resolve(cfg.metaDescription),
    },
  };
}

function difficultyStyles(d: string) {
  switch (d) {
    case "Easy": return { badge: "bg-green-100 text-green-700", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
    case "Medium": return { badge: "bg-yellow-100 text-yellow-700", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" };
    case "Hard": return { badge: "bg-red-100 text-red-700", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" };
    default: return { badge: "bg-gray-100 text-gray-700", icon: "" };
  }
}

export default async function EarnMoneyOnlinePage({ params }: Props) {
  const { slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) notFound();

  const year = getCurrentYear();
  const countries = getCountries();
  const methods = getEarnMoneyMethods(c.code, c.currency);
  const cfg = getConfig();

  const resolve = (tpl: string) =>
    tpl
      .replace(/\{country\}/g, c.name)
      .replace(/\{year\}/g, String(year))
      .replace(/\{currency\}/g, c.currency);

  const siteUrl = "https://www.bestpayingjobs.net";
  const pageUrl = `${siteUrl}/earn-money-online/${c.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: resolve(cfg.breadcrumbLabel), item: pageUrl },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: resolve(cfg.metaTitle),
    description: resolve(cfg.metaDescription),
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      name: `20 Ways to Earn Money Online in ${c.name}`,
      itemListElement: methods.map((m) => ({
        "@type": "ListItem",
        position: m.rank,
        item: {
          "@type": "CreativeWork",
          name: m.title,
          description: m.description,
        },
      })),
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <TrackingRedirect />
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <Link
            href={`/best-paying-jobs-in/${c.slug}/`}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            View Full-Time Jobs in {c.name}
          </Link>

          <div className="mb-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Earn Money Online in {c.name} {year}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {methods.length} Proven Ways &middot; Earning potential in {c.currency} &middot; Updated for {year}
            </p>
          </div>
          <div className="mt-4">
            <ShareButtons title={`Earn Money Online in ${c.name} — 20 Ways ${year}`} url={pageUrl} />
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        {methods.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {methods.length} Ways to Earn Money Online in {c.name}
            </h2>

            <div className="space-y-6">
              {methods.map((method) => {
                const ds = difficultyStyles(method.difficulty);
                return (
                  <div
                    key={method.rank}
                    className="bg-white rounded-xl border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-emerald-50 to-white px-5 py-3 flex items-center justify-between gap-3 border-b border-emerald-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0">
                          {method.rank}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{method.title}</h3>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${ds.badge}`}>
                        {method.difficulty}
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-0.5">Hourly Rate</p>
                          <p className="text-base font-bold text-emerald-600">
                            {Intl.NumberFormat("en-US").format(method.hourlyRate)} {c.currency}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-0.5">Min Potential</p>
                          <p className="text-base font-bold text-gray-900">
                            {Intl.NumberFormat("en-US").format(method.potentialMin)} {c.currency}/mo
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-0.5">Max Potential</p>
                          <p className="text-base font-bold text-gray-900">
                            {Intl.NumberFormat("en-US").format(method.potentialMax)} {c.currency}/mo
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-0.5">First Payout</p>
                          <p className="text-base font-bold text-gray-900">{method.timeToFirstPayout}</p>
                        </div>
                      </div>

                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((method.hourlyRate / methods[0].hourlyRate) * 100))}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pros
                          </p>
                          <ul className="space-y-1">
                            {method.pros.map((pro, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-500 mb-2 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cons
                          </p>
                          <ul className="space-y-1">
                            {method.cons.map((con, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed">
                        {method.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-gray-400">Skills:</span>
                          {method.skills.map((skill, i) => (
                            <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-gray-400">Platforms:</span>
                        {method.platforms.map((p, i) => (
                          <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Time to full income: <strong className="text-gray-700">{method.timeToFullIncome}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mb-12 rounded-xl border border-gray-200 bg-white px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Explore More About Working in {c.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Compare full-time salaries, part-time opportunities, cost of living, and take-home pay in {c.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/best-paying-jobs-in/${c.slug}/`} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              Full-Time Jobs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href={`/part-time-jobs-in/${c.slug}/`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
              Part-Time Jobs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href={`/average-salary/${c.slug}/`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
              Average Salary
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href={`/cost-of-living/${c.slug}/`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
              Cost of Living
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href={`/take-home-pay/${c.slug}/`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
              Take-Home Pay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>
      </main>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Browse Other Countries
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {seededShuffle(
              countries.filter((x) => x.code !== c.code),
              c.code
            ).slice(0, 12).map((oc) => (
              <Link
                key={oc.code}
                href={`/earn-money-online/${oc.slug}`}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-3 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <FlagImage slug={oc.slug} name={oc.name} className="w-6 h-6 rounded-sm" />
                <span className="text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">{oc.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-sm leading-snug">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Earning potential estimates are based on platform averages, cost of living data, and exchange rates. Actual earnings vary based on experience, skills, and market conditions.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
