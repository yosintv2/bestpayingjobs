import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountries, getCategories, getCountryJobs, getCurrentYear, getCategoryBySlug } from "@/lib/db";
import { getCategorySalaries } from "@/lib/category-stats";
import { toUSD, formatAnnual, formatMonthly } from "@/lib/salary";
import { seededShuffle } from "@/lib/shuffle";
import CategorySalaryChart from "@/components/CategorySalaryChart";
import StaticSalaryChart from "@/components/StaticSalaryChart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";
import posts from "@/data/blog-posts.json";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getCategories().map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `Best Paying Jobs in ${cat.name} (${getCurrentYear()}) in Every Country | BestPayingJobs.net`,
    description: `Discover the highest paying ${cat.name.toLowerCase()} jobs in 195 countries. Compare salaries, find top careers, and make data-driven career decisions.`,
    openGraph: {
      title: `Best Paying Jobs in ${cat.name} (${getCurrentYear()})`,
      description: `Discover the highest paying ${cat.name.toLowerCase()} jobs across 195 countries.`,
    },
  };
}

export default async function JobsByCategoryPage({ params }: Props) {
  const { slug } = await params;
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const salaryStats = getCategorySalaries();
  const catStats = salaryStats[slug];
  const topCountries = catStats?.countrySalaries.slice(0, 15) ?? [];

  const chartData = topCountries.map((c) => ({
    country: c.name,
    salary: c.avgMax,
    flag: c.flag,
  }));

  const titleMap = new Map<string, { salaries: number[]; countries: string[] }>();

  for (const country of countries) {
    const data = getCountryJobs(country.code);
    if (!data) continue;
    const jobs = data.jobs[slug];
    if (!jobs) continue;
    for (const job of jobs) {
      if (!titleMap.has(job.title)) {
        titleMap.set(job.title, { salaries: [], countries: [] });
      }
      const entry = titleMap.get(job.title)!;
      entry.salaries.push(toUSD(job.salaryMax, data.currency));
      if (!entry.countries.includes(country.name)) {
        entry.countries.push(country.name);
      }
    }
  }

  const globalTopJobs = [...titleMap.entries()]
    .map(([title, info]) => ({
      title,
      avgSalary: Math.round(info.salaries.reduce((a, b) => a + b, 0) / info.salaries.length),
      maxSalary: Math.max(...info.salaries),
      countryCount: info.countries.length,
    }))
    .sort((a, b) => b.avgSalary - a.avgSalary)
    .slice(0, 10);

  const featuredCountries = countries
    .map((c) => ({ country: c, data: getCountryJobs(c.code) }))
    .filter((x) => x.data && x.data.jobs[slug])
    .sort((a, b) => {
      const aMax = Math.max(...(a.data?.jobs[slug]?.map((j) => j.salaryMax) ?? [0]));
      const bMax = Math.max(...(b.data?.jobs[slug]?.map((j) => j.salaryMax) ?? [0]));
      return bMax - aMax;
    })
    .slice(0, 6);

  const siteUrl = "https://www.bestpayingjobs.net";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Jobs by Category", item: `${siteUrl}/jobs` },
      { "@type": "ListItem", position: 3, name: cat.name, item: `${siteUrl}/jobs/${slug}` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            All Job Categories
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Best Paying Jobs in {cat.name} ({year})
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
            {cat.description.replace(/\{country\}/g, "Every Country")}
          </p>
          {catStats && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400">Global avg. top salary:</span>
                <span className="font-bold text-emerald-600">{formatAnnual(catStats.avgMaxSalary)}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400">Countries with data:</span>
                <span className="font-bold text-gray-900">{topCountries.length}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Highest Paying Countries</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <CategorySalaryChart data={chartData} />
            <noscript>
              <div className="mt-4">
                <StaticSalaryChart data={chartData} category={cat.name} />
              </div>
            </noscript>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top {cat.name} Jobs Worldwide</h2>
          <div className="grid gap-3">
            {globalTopJobs.map((job, i) => (
              <div key={job.title} className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-emerald-600">{i + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-400">Available in {job.countryCount} countries</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-600">{formatAnnual(job.avgSalary)}</div>
                  <div className="text-xs text-gray-400">avg. salary</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Paying Countries for {cat.name}</h2>
          <p className="text-sm text-gray-500 mb-6">Browse {cat.name.toLowerCase()} jobs in the highest paying markets.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCountries.map(({ country, data }) => {
              const jobs = data!.jobs[slug]!;
              const topJob = jobs.reduce((a, b) => (a.salaryMax > b.salaryMax ? a : b));
              return (
                <Link
                  key={country.code}
                  href={`/best-paying-jobs-in-${country.slug}/#${slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FlagImage slug={country.slug} name={country.name} className="w-7 h-7 rounded-sm shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">{country.name}</h3>
                      <p className="text-xs text-gray-400">{jobs.length} jobs in {cat.name}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs text-gray-400 mb-2">Highest paying role:</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 truncate">{topJob.title}</span>
                      <span className="text-sm font-bold text-emerald-600 shrink-0 ml-2">
                        {formatMonthly(toUSD(topJob.salaryMax, data!.currency))}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Countries with {cat.name} Data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {countries
              .map((c) => ({ country: c, data: getCountryJobs(c.code) }))
              .filter((x) => x.data && x.data.jobs[slug])
              .map(({ country }) => (
                <Link
                  key={country.code}
                  href={`/best-paying-jobs-in-${country.slug}/#${slug}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-sm"
                >
                  <FlagImage slug={country.slug} name={country.name} className="w-5 h-5 rounded-sm shrink-0" />
                  <span className="text-gray-700 font-medium truncate">{country.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Related Categories</h2>
          <div className="flex flex-wrap gap-2">
            {seededShuffle(categories.filter((x) => x.slug !== slug), slug).slice(0, 8).map((other) => (
              <Link key={other.slug} href={`/jobs/${other.slug}`} className="text-xs bg-white border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 px-3 py-1.5 rounded-full transition-colors">{other.name}</Link>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-6">
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

      <Footer />
    </div>
  );
}
