import Link from "next/link";
import CountrySearch from "@/components/CountrySearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";
import {
  getCountries,
  getCategories,
  getCurrentYear,
  getCountryJobs,
  type CountryJobs,
} from "@/lib/db";
import { toUSD, formatAnnual } from "@/lib/salary";
import posts from "@/data/blog-posts.json";

function formatSalary(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

const categoryIcons: Record<string, string> = {
  "ai-machine-learning": "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "finance-accounting": "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  healthcare: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  engineering: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  technology: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  legal: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  marketing: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
  education: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
};

const defaultIcon = "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4";

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

  const catStats: Record<string, { countryCount: number; jobCount: number }> = {};
  for (const cat of categories) {
    catStats[cat.slug] = { countryCount: 0, jobCount: 0 };
  }
  for (const { data } of countryJobs) {
    for (const [slug, jobs] of Object.entries(data.jobs)) {
      if (catStats[slug]) {
        catStats[slug].countryCount++;
        catStats[slug].jobCount += jobs.length;
      }
    }
  }

  const titleMap: Record<string, { salaries: number[]; countryCount: number }> = {};
  for (const { country, data } of countryJobs) {
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

  const globalTop6 = globalTopJobs.slice(0, 6);
  const globalTopMore = globalTopJobs.slice(6, 12);

  const blogPosts = (posts as typeof posts).slice(0, 3);

  const siteUrl = "https://www.bestpayingjobs.net";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best Paying Jobs in Every Country (${year})`,
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
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListSchema) }} />
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-semibold mb-8 backdrop-blur-sm border border-emerald-200/50">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Updated {year} &middot; {countries.length} countries &middot; {categories.length} career categories
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Best Paying Jobs in{' '}
              <span className="text-emerald-600">Every Country</span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Compare salaries across {countries.length} countries and {categories.length} career categories.
              Make data-driven career decisions with real compensation insights.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto">
              <CountrySearch />
              <Link href="#countries" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 shrink-0">
                Browse All Countries
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Highest Paying Jobs Worldwide</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Top roles ranked by global average salary across all {countries.length} countries.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-3">
              {globalTop6.map((job, i) => (
                <div key={job.title} className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-sm font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{job.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Global avg: <span className="font-semibold text-emerald-600">{formatAnnual(job.avgUSD)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400">up to</div>
                    <div className="text-sm font-bold text-gray-900">{formatAnnual(job.maxUSD)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {globalTopMore.map((job, i) => (
                <div key={job.title} className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-sm font-bold text-white">{i + 7}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{job.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Global avg: <span className="font-semibold text-emerald-600">{formatAnnual(job.avgUSD)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400">up to</div>
                    <div className="text-sm font-bold text-gray-900">{formatAnnual(job.maxUSD)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Career Category</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Explore the highest paying jobs across {categories.length} career fields spanning all {countries.length} countries.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const stats = catStats[cat.slug];
              const jobCount = stats?.jobCount ?? 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/jobs/${cat.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors leading-snug">
                    {cat.name}
                  </div>
                  <div className="mt-2 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {cat.description.replace(/\{country\}/g, "your country")}
                  </div>
                  <div className="mt-3">
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{jobCount} roles tracked</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="countries" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">All Countries</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Select a country to view its highest paying jobs, salary ranges, and career opportunities.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3">
            {countries.map((c) => {
              const cd = countryJobs.find((x) => x.country.code === c.code);
              const jobCount = cd ? Object.values(cd.data.jobs).flat().length : 0;
              return (
                <Link
                  key={c.code}
                  href={`/best-paying-jobs-in-${c.slug}`}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/20 hover:-translate-y-1 transition-all duration-200"
                >
                  <FlagImage slug={c.slug} name={c.name} className="w-7 h-7 group-hover:scale-110 transition-transform duration-200 rounded-sm" />
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">{c.name}</span>
                  <span className="text-[10px] text-gray-400">{jobCount} jobs</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">From Our Blog</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Career advice, salary guides, and expert tips to boost your earning potential.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {blogPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/20 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.summary}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              View All Articles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-300/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Know Your Worth, Anywhere in the World</h2>
          <p className="mt-4 text-emerald-100 max-w-2xl mx-auto text-lg">
            Access salary data for {countries.length} countries across {categories.length} career categories.
            Make informed career decisions with real compensation insights.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="#countries" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-all shadow-lg shadow-black/10">
              Explore Countries
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all">
              View Categories
            </Link>
            <Link href="/global-ranking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all">
              Global Ranking
            </Link>
          </div>
          <div className="mt-16 pt-10 border-t border-emerald-500/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Countries", value: countries.length, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Categories", value: categories.length, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { label: "Data Points", value: `${totalJobs.toLocaleString()}+`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                { label: "Updated", value: year, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d={s.icon} /></svg>
                  </div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="mt-1 text-sm text-emerald-200">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Salary data on this page is based on research from the{" "}
            <a href="https://www.erieri.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Economic Research Institute (ERI)</a>{" "}
            and{" "}
            <a href="https://www.salaryexpert.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">SalaryExpert</a>.{" "}
            Figures are estimates and may vary based on experience, location, and industry.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}