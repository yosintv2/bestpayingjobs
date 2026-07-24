import Link from "next/link";
import { getCountries, getCategories, getCountryJobs, getCurrentYear } from "@/lib/db";
import { getCategorySalaries } from "@/lib/category-stats";
import { toUSD, formatAnnual, formatMonthly } from "@/lib/salary";
import CategorySalaryChart from "@/components/CategorySalaryChart";
import StaticSalaryChart from "@/components/StaticSalaryChart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";
import posts from "@/data/blog-posts.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Highest Paying AI Jobs 2026 — AI & Machine Learning Salaries by Country",
  description:
    "Discover the highest paying AI and machine learning jobs across 195 countries in 2026. Compare AI engineer salaries, data scientist pay, and machine learning engineer compensation worldwide.",
  openGraph: {
    title: "Highest Paying AI Jobs 2026 — AI & Machine Learning Salaries by Country",
    description:
      "Compare AI engineer, ML engineer, and data scientist salaries across 195 countries. Find where AI skills pay the most in 2026.",
  },
};

export default function AiMachineLearningPage() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();
  const slug = "ai-machine-learning";

  const salaryStats = getCategorySalaries();
  const catStats = salaryStats[slug];
  const topCountries = catStats?.countrySalaries.slice(0, 15) ?? [];

  const chartData = topCountries.map((c) => ({
    country: c.name,
    salary: c.avgMax,
    flag: c.flag,
  }));

  const allJobsInCategory: { title: string; salaries: number[]; countries: string[] }[] = [];
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
    .sort((a, b) => b.avgSalary - a.avgSalary);

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the highest paying AI job in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI Research Scientist is the highest paying AI job globally, with salaries reaching up to $200,000+ annually in top markets like the United States and Switzerland. Machine Learning Engineer and Deep Learning Engineer follow closely.",
        },
      },
      {
        "@type": "Question",
        name: "Which country pays the most for AI jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The United States, Switzerland, Denmark, and Australia consistently offer the highest AI salaries. US AI engineers earn $120,000-$200,000+ annually while top European markets offer $80,000-$150,000.",
        },
      },
      {
        "@type": "Question",
        name: "How much do machine learning engineers make in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Machine Learning Engineers earn between $80,000 and $180,000 annually depending on location. The global average salary for ML engineers is approximately $95,000 per year.",
        },
      },
      {
        "@type": "Question",
        name: "Do AI jobs require a degree?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While many AI roles prefer a master's or PhD, the field increasingly values practical skills. Bootcamp graduates and self-taught professionals with strong portfolios can land AI engineering roles, especially in machine learning operations and data science.",
        },
      },
      {
        "@type": "Question",
        name: "Is AI a good career in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI is one of the fastest growing career fields in 2026. AI-related skills command 30-50% salary premiums over non-AI roles, and demand continues to outpace supply across all 195 countries in our database.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${siteUrl}/category` },
      { "@type": "ListItem", position: 3, name: "AI & Machine Learning", item: `${siteUrl}/category/ai-machine-learning` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-6">
            2026 Differentiator &middot; Fastest Growing Category
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
            Highest Paying{' '}
            <span className="text-emerald-600">AI Jobs</span> in 2026
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-3xl leading-relaxed mb-8">
            AI and machine learning careers offer the fastest salary growth across all industries.
            Compare AI engineer, data scientist, and ML engineer salaries across 195 countries.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">195</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Countries</div>
                <div className="text-xs text-gray-400">with AI salary data</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">10</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">AI Job Roles</div>
                <div className="text-xs text-gray-400">per country</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">{catStats ? formatAnnual(catStats.avgMaxSalary) : ""}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Global Avg</div>
                <div className="text-xs text-gray-400">top AI salary / yr</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Salaries by Country</h2>
          <p className="text-sm text-gray-500 mb-6">Which countries pay AI professionals the most in 2026? The chart below shows average AI job salaries across the top 15 markets.</p>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <CategorySalaryChart data={chartData} />
            <noscript>
              <div className="mt-4">
                <StaticSalaryChart data={chartData} category="AI & Machine Learning" />
              </div>
            </noscript>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Top AI Jobs Worldwide</h2>
          <p className="text-sm text-gray-500 mb-6">The highest paying AI and machine learning roles ranked by global average salary across 195 countries.</p>
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
                  <div className="text-xs text-gray-400">global avg.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why AI Careers Pay More in 2026</h2>
          <p className="text-sm text-gray-500 mb-8">AI skills command significant salary premiums. Here is what is driving compensation higher.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Demand Outpaces Supply",
                desc: "There are 3x more AI job openings than qualified candidates. Companies compete aggressively for talent, driving salaries up 30-50% above traditional tech roles.",
              },
              {
                title: "AI Transforms Every Industry",
                desc: "Healthcare, finance, manufacturing, and retail all need AI expertise. This cross-industry demand means AI professionals are never limited to one sector.",
              },
              {
                title: "Specialized Skills Premium",
                desc: "Deep learning, NLP, computer vision, and MLOps are highly specialized skills. Professionals with expertise in these areas command the highest premiums.",
              },
              {
                title: "Remote Work Expands Access",
                desc: "AI roles are increasingly remote-friendly. Engineers in lower-cost countries can earn near US-level salaries working for global companies.",
              },
              {
                title: "AI Budgets Are Growing",
                desc: "Companies allocate 15-30% of tech budgets to AI initiatives. This investment directly translates to higher compensation for AI talent.",
              },
              {
                title: "Executive Attention",
                desc: "AI is a board-level priority. AI leaders report directly to CEOs, and compensation reflects this strategic importance.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Paying Countries for AI Jobs</h2>
          <p className="text-sm text-gray-500 mb-6">Browse AI and machine learning jobs in the highest paying markets worldwide.</p>
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
                      <p className="text-xs text-gray-400">{jobs.length} AI jobs</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs text-gray-400 mb-2">Top AI role:</div>
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

      <section className="py-12 bg-emerald-600">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your AI Career?</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Browse detailed AI job listings, salaries, and career paths for every country on our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/blog/how-ai-changing-job-market"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-all shadow-lg"
            >
              Read AI Career Guide
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link
              href="/#countries"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              Browse Countries
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500 mb-8">Common questions about AI careers and salaries in 2026.</p>
          <div className="grid gap-4">
            {[
              {
                q: "What is the highest paying AI job in 2026?",
                a: "AI Research Scientist is the highest paying AI job globally, with salaries reaching up to $200,000+ annually in top markets like the United States and Switzerland.",
              },
              {
                q: "Which country pays the most for AI jobs?",
                a: "The United States, Switzerland, Denmark, and Australia consistently offer the highest AI salaries. US AI engineers earn $120,000-$200,000+ annually.",
              },
              {
                q: "How much do machine learning engineers make in 2026?",
                a: "Machine Learning Engineers earn between $80,000 and $180,000 annually depending on location. The global average salary for ML engineers is approximately $95,000 per year.",
              },
              {
                q: "Do AI jobs require a degree?",
                a: "While many AI roles prefer advanced degrees, the field increasingly values practical skills. Bootcamp graduates and self-taught professionals with strong portfolios can land AI roles.",
              },
              {
                q: "Is AI a good career in 2026?",
                a: "AI is one of the fastest growing career fields. AI-related skills command 30-50% salary premiums and demand continues to outpace supply across all 195 countries.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-gray-200 bg-white [&[open]]:border-emerald-200">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                  <span className="font-medium text-gray-900 group-open:text-emerald-600 transition-colors">{faq.q}</span>
                  <svg className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Countries with AI Job Data</h2>
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

      <Footer />
    </div>
  );
}
