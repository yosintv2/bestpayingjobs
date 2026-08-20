import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCountries,
  getCountryBySlug,
  getCountryJobs,
  getCurrentYear,
  getCategories,
} from "@/lib/db";
import { toUSD, adjustedSalary } from "@/lib/salary";
import colIndex from "@/data/col-index.json";
import fxRatesData from "@/data/fx-rates.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import FlagImage from "@/components/FlagImage";
import ChartSection from "@/components/ChartSection";
import CategoryAccordion from "@/components/CategoryAccordion";
import TrackingRedirect from "@/components/TrackingRedirect";
import { seededShuffle } from "@/lib/shuffle";
import posts from "@/data/blog-posts.json";
import { costOfLivingKeywords } from "@/lib/keywords";

const colData = colIndex as Record<string, number>;

export async function generateStaticParams() {
  const countries = getCountries();
  return countries
    .filter((c) => c.code in colData)
    .map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) return {};
  const year = getCurrentYear();
  const index = colData[c.code];

  const metaImage = {
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    width: 1200,
    height: 750,
    alt: `Cost of living in ${c.name} — COL index and salary adjustment data`,
  };

  return {
    title: `Cost of Living in ${c.name} ${year} | COL Index & Adjusted Salaries | BestPayingJobs.net`,
    description: `Cost of living in ${c.name} is ${index}% of the US national average in ${year}. See how far your salary goes, compare purchasing power across categories.`,
    keywords: costOfLivingKeywords({ country: c.name, year: getCurrentYear() }),
    alternates: {
      canonical: `https://www.bestpayingjobs.net/cost-of-living-${c.slug}`,
    },
    openGraph: {
      title: `Cost of Living in ${c.name} ${year} | BestPayingJobs.net`,
      description: `COL index for ${c.name} is ${index}%. Compare adjusted salaries and purchasing power for ${year}.`,
      url: `https://www.bestpayingjobs.net/cost-of-living-${c.slug}`,
      images: [metaImage],
    },
    twitter: {
      title: `Cost of Living in ${c.name} ${year} | BestPayingJobs.net`,
      description: `COL index for ${c.name} is ${index}%. Compare adjusted salaries and purchasing power for ${year}.`,
      card: "summary_large_image",
      images: [metaImage],
    },
  };
}

const colCategories = [
  { slug: "housing", name: "Housing", text: (c: number) => `Housing in countries with a cost index of ${c}% tends to be the largest expense, often consuming 30-40% of income. Rent, utilities, and property costs vary significantly between urban and rural areas.` },
  { slug: "food", name: "Food", text: (c: number) => `Groceries and dining out in countries at ${c}% COL can vary widely. Local markets offer lower prices while imported goods cost more. Cooking at home is generally more affordable.` },
  { slug: "transportation", name: "Transportation", text: (c: number) => `Public transit and fuel costs in a ${c}% COL country. Many countries have efficient public transportation systems that reduce the need for personal vehicles.` },
  { slug: "healthcare", name: "Healthcare", text: (c: number) => `Healthcare costs and insurance in ${c}% COL countries. Some countries have universal healthcare systems that significantly reduce out-of-pocket expenses.` },
  { slug: "education", name: "Education", text: (c: number) => `Education and childcare costs vary greatly with COL index. Public education is often subsidized while international schools charge premium fees.` },
  { slug: "utilities", name: "Utilities", text: (c: number) => `Electricity, water, internet, and other essential services. Weather patterns affect utility usage and costs significantly.` },
  { slug: "clothing", name: "Clothing", text: (c: number) => `Apparel costs in ${c}% COL environments. Imported brands cost more while local clothing is generally affordable.` },
  { slug: "entertainment", name: "Entertainment", text: (c: number) => `Leisure activities and entertainment expenses. Costs for cinema, dining, and recreational activities scale with the overall COL index.` },
];

function faqSchema(pageUrl: string, cName: string, index: number, adjustedLocal: string, currency: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What is the cost of living in ${cName}?`, acceptedAnswer: { "@type": "Answer", text: `The cost of living in ${cName} is ${index}% of the U.S. national average. This means ${index < 100 ? "it is less expensive than" : index > 100 ? "it is more expensive than" : "it is comparable to"} living in the average U.S. city.` } },
      { "@type": "Question", name: `How is the cost of living in ${cName} calculated?`, acceptedAnswer: { "@type": "Answer", text: `The cost of living index is based on prices for housing, food, transportation, healthcare, and other goods and services compared to the U.S. national average of 100.` } },
      { "@type": "Question", name: `What salary do I need to live comfortably in ${cName}?`, acceptedAnswer: { "@type": "Answer", text: `Salaries in ${cName} should be adjusted by the cost of living index to keep the same purchasing power. A salary equivalent to the U.S. national average corresponds to roughly ${adjustedLocal} ${currency} in ${cName}.` } },
    ],
  };
}

export default async function CostOfLivingPage({ params }: Props) {
  const { slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) notFound();

  const index = colData[c.code];
  if (!index) notFound();

  const data = getCountryJobs(c.code);
  const year = getCurrentYear();
  const categories = getCategories();
  const countries = getCountries();

  const siteUrl = "https://www.bestpayingjobs.net";
  const pageUrl = `${siteUrl}/cost-of-living-${c.slug}`;
  const fxRate = (fxRatesData as Record<string, number>)[data?.currency ?? "USD"] ?? 1;

  const top10 = (data?.top10 ?? []).map((j) => ({
    ...j,
    colSalaryMin: adjustedSalary(toUSD(j.salaryMin, data?.currency ?? "USD"), c.code),
    colSalaryMax: adjustedSalary(toUSD(j.salaryMax, data?.currency ?? "USD"), c.code),
    colSalaryMinLocal: Math.round(adjustedSalary(toUSD(j.salaryMin, data?.currency ?? "USD"), c.code) * fxRate),
    colSalaryMaxLocal: Math.round(adjustedSalary(toUSD(j.salaryMax, data?.currency ?? "USD"), c.code) * fxRate),
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Cost of Living", item: `${siteUrl}/cost-of-living` },
      { "@type": "ListItem", position: 3, name: `Cost of Living in ${c.name}`, item: pageUrl },
    ],
  };

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    name: `Cost of Living in ${c.name}`,
    description: `Cost of living comparison chart for ${c.name} showing the COL index and salary adjustments for ${year}.`,
    representativeOfPage: true,
    thumbnail: {
      "@type": "ImageObject",
      contentUrl: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
      width: 1200,
      height: 750,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(
              pageUrl,
              c.name,
              index,
              Intl.NumberFormat("en-US").format(Math.round(adjustedSalary(100000, c.code) * fxRate)),
              c.currency
            )
          ),
        }}
      />
      <TrackingRedirect />
      <Header />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Cost of Living in {c.name} ({year})
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              COL Index: {index}% of U.S. national average &middot; Updated for {year}
            </p>
          </div>
          <div className="mt-4">
            <ShareButtons title={`Cost of Living in ${c.name} ${year}`} />
          </div>
        </div>

        <section className="mt-8 mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Cost of Living Index</p>
            <p className="text-3xl font-bold text-gray-900">{index}%</p>
            <p className="text-xs text-gray-400 mt-1">vs U.S. average (100%)</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Relative Cost</p>
            <p className="text-lg font-bold text-gray-900">
              {index < 50 ? "Very Low" : index < 75 ? "Below Average" : index < 100 ? "Slightly Below" : index < 125 ? "Slightly Above" : index < 150 ? "Above Average" : "Very High"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Compared to U.S.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Currency</p>
            <p className="text-2xl font-bold text-gray-900">{data?.currency ?? c.currency}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Salary Data</p>
            <p className="text-2xl font-bold text-gray-900">{data ? `${top10.length} Jobs` : "N/A"}</p>
            <p className="text-xs text-gray-400 mt-1">Top 10 highest paying</p>
          </div>
        </section>

        {top10.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 10 Jobs in {c.name} — COL-Adjusted Salaries
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Job Title</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Local Salary</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">COL-Adjusted ({data!.currency})</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.map((job) => (
                    <tr key={job.rank} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-400 font-medium">{job.rank}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{job.title}</td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {Intl.NumberFormat("en-US").format(job.salaryMin)}–{Intl.NumberFormat("en-US").format(job.salaryMax)} {data!.currency}/mo
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                        {Intl.NumberFormat("en-US").format(job.colSalaryMinLocal)}–{Intl.NumberFormat("en-US").format(job.colSalaryMaxLocal)} {data!.currency}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              * COL-adjusted salary is shown in {data!.currency}, restated at the purchasing power
              implied by the cost of living index for {c.name}.
            </p>
          </section>
        )}

        {data && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Salary vs. Cost of Living by Category in {c.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg. Salary (Local)</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">COL-Adjusted ({data.currency})</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Purchasing Power</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.filter((cat) => (data.jobs[cat.slug]?.length ?? 0) > 0).map((cat) => {
                    const jobs = data.jobs[cat.slug];
                    const avgLocal = jobs.reduce((s, j) => s + (j.salaryMin + j.salaryMax) / 2, 0) / jobs.length;
                    const avgUSD = toUSD(avgLocal, data.currency);
                    const avgCOL = adjustedSalary(avgUSD, c.code);
                    const avgCOLLocal = Math.round(avgCOL * fxRate);
                    const diff = ((avgCOL - avgUSD) / avgUSD * 100);
                    return (
                      <tr key={cat.slug} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{cat.name}</td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {Intl.NumberFormat("en-US").format(Math.round(avgLocal))} {data.currency}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                          {Intl.NumberFormat("en-US").format(avgCOLLocal)} {data.currency}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-xs font-semibold ${diff > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {diff > 0 ? "+" : ""}{Math.round(diff)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-12 prose prose-sm max-w-none text-gray-700">
          <h2 className="text-xl font-semibold text-gray-900">Cost of Living in {c.name} — Overview</h2>
          <p>
            The cost of living in {c.name} is <strong>{index}%</strong> of the U.S. national average.
            {index < 80
              ? ` This makes ${c.name} a more affordable destination compared to the United States. Your salary goes further here, especially for housing, food, and services.`
              : index > 120
              ? ` This makes ${c.name} a more expensive place to live than the average U.S. city. Housing, dining, and services tend to cost more.`
              : ` This means the cost of living in ${c.name} is roughly comparable to the U.S. national average.`}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">Purchasing Power in {c.name}</h3>
          <p>
            A salary with the purchasing power of the U.S. national average works out at
            approximately{" "}
            <strong>{Intl.NumberFormat("en-US").format(Math.round(adjustedSalary(100000, c.code) * fxRate))} {c.currency}</strong>{" "}
            in {c.name} for the same standard of living.
            {index < 80 ? " This means your money goes further in " + c.name + ", making it an attractive destination for remote workers and expats." : index > 120 ? " This means goods and services in " + c.name + " are more expensive, so you need a higher salary to maintain the same lifestyle." : ""}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Cost of Living Categories in {c.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {colCategories.map((cat) => (
              <div key={cat.slug} className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.text(index)}</p>
              </div>
            ))}
          </div>
        </section>

        {top10.length > 0 && (
          <ChartSection
            jobs={top10}
            currency={data?.currency ?? c.currency}
            countryName={c.name}
            countrySlug={c.slug}
          />
        )}

        <section className="mb-12 rounded-xl border border-gray-200 bg-white px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Top Paying Jobs in {c.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            See the full list of highest paying careers and salaries in {c.name}.
          </p>
          <Link
            href={`/best-paying-jobs-in-${c.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Best Paying Jobs in {c.name}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        <section className="mb-12 rounded-xl border border-gray-200 bg-white px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Take-Home Pay in {c.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Estimate your after-tax salary and see how much you keep after deductions in {c.name}.
          </p>
          <Link
            href={`/take-home-pay-${c.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            Take-Home Pay in {c.name}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">What is the cost of living in {c.name}?</summary>
              <div className="px-5 pb-4 text-sm text-gray-500">The cost of living in {c.name} is {index}% of the U.S. national average. This means {index < 100 ? "it is less expensive than" : index > 100 ? "it is more expensive than" : "it is comparable to"} living in the average U.S. city.</div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">How is the cost of living in {c.name} calculated?</summary>
              <div className="px-5 pb-4 text-sm text-gray-500">The cost of living index is based on prices for housing, food, transportation, healthcare, and other goods and services compared to the U.S. national average of 100.</div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">What salary do I need to live comfortably in {c.name}?</summary>
              <div className="px-5 pb-4 text-sm text-gray-500">Salaries in {c.name} should be adjusted by the cost of living index to keep the same purchasing power. A salary equivalent to the U.S. national average corresponds to roughly {Intl.NumberFormat("en-US").format(Math.round(adjustedSalary(100000, c.code) * fxRate))} {c.currency} in {c.name}.</div>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Job Categories in {c.name}
          </h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <CategoryAccordion
                key={cat.slug}
                category={cat}
                jobs={data?.jobs[cat.slug] ?? []}
                currency={data?.currency ?? c.currency}
                year={year}
                countryName={c.name}
                countrySlug={c.slug}
              />
            ))}
          </div>
        </section>
      </main>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Other Countries</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {seededShuffle(countries.filter((x) => x.code !== c.code && x.code in colData), c.code).slice(0, 12).map((oc) => (
              <Link
                key={oc.code}
                href={`/best-paying-jobs-in-${oc.slug}`}
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
              <Link key={post.id} href={`/blog/${post.id}`} className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-200 hover:shadow-lg transition-all duration-200">
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
            Cost of living data is based on the{' '}
            <a href="https://www.numbeo.com/cost-of-living/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Numbeo Cost of Living Index</a>{' '}
            and other reliable sources. Figures are estimates and may vary based on location, lifestyle, and consumption patterns.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
