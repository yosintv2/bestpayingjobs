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

const fxRates = fxRatesData as Record<string, number>;
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackingRedirect from "@/components/TrackingRedirect";
import ShareButtons from "@/components/ShareButtons";
import FlagImage from "@/components/FlagImage";
import ChartSection from "@/components/ChartSection";
import CategoryAccordion from "@/components/CategoryAccordion";
import { seededShuffle } from "@/lib/shuffle";
import posts from "@/data/blog-posts.json";
import { takeHomePayKeywords } from "@/lib/keywords";

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

  const metaImage = {
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    width: 1200,
    height: 750,
    alt: `Take-home pay in ${c.name} — after-tax salary estimates`,
  };

  return {
    title: `Take-Home Pay in ${c.name} ${year} | After-Tax Salary Calculator | BestPayingJobs.net`,
    description: `Calculate take-home pay in ${c.name} for ${year}. See gross-to-net salary breakdowns, tax rates, and how much you keep after deductions.`,
    keywords: takeHomePayKeywords({
      country: c.name,
      year: getCurrentYear(),
      currency: c.currency,
    }),
    alternates: {
      canonical: `https://www.bestpayingjobs.net/take-home-pay-${c.slug}`,
    },
    openGraph: {
      title: `Take-Home Pay in ${c.name} ${year} | BestPayingJobs.net`,
      description: `Calculate your after-tax salary in ${c.name}. See tax breakdowns, deductions, and net pay for ${year}.`,
      url: `https://www.bestpayingjobs.net/take-home-pay-${c.slug}`,
      images: [metaImage],
    },
    twitter: {
      title: `Take-Home Pay in ${c.name} ${year} | BestPayingJobs.net`,
      description: `Calculate your after-tax salary in ${c.name}. See tax breakdowns, deductions, and net pay for ${year}.`,
      card: "summary_large_image",
      images: [metaImage],
    },
  };
}

function effectiveTaxRate(index: number): number {
  if (index < 30) return 0.10;
  if (index < 45) return 0.15;
  if (index < 60) return 0.20;
  if (index < 75) return 0.25;
  if (index < 90) return 0.28;
  if (index < 105) return 0.30;
  if (index < 120) return 0.33;
  return 0.35;
}

function faqSchema(pageUrl: string, cName: string, rate: number) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What is the take-home pay in ${cName}?`, acceptedAnswer: { "@type": "Answer", text: `The take-home pay in ${cName} depends on your gross salary and the effective tax rate of ${Math.round(rate * 100)}%. After income tax and social contributions, you keep approximately ${Math.round((1 - rate) * 100)}% of your gross income.` } },
      { "@type": "Question", name: `How are taxes calculated in ${cName}?`, acceptedAnswer: { "@type": "Answer", text: `Tax calculations include income tax, social security contributions, and other mandatory deductions. The effective tax rate of ${Math.round(rate * 100)}% is an estimate based on the cost of living index.` } },
      { "@type": "Question", name: `What is the difference between gross and net salary in ${cName}?`, acceptedAnswer: { "@type": "Answer", text: `Gross salary is your total compensation before deductions. Net salary (take-home pay) is what you actually receive after income tax, social security, Medicare, and other deductions are subtracted.` } },
    ],
  };
}

export default async function TakeHomePayPage({ params }: Props) {
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
  const pageUrl = `${siteUrl}/take-home-pay-${c.slug}`;

  const taxRate = effectiveTaxRate(index);
  const ssRate = 0.062;
  const medicareRate = 0.0145;
  const totalDeductionRate = taxRate + ssRate + medicareRate;

  const currency = data?.currency ?? c.currency;
  const fxRate = fxRates[currency] ?? 1;

  const top10 = (data?.top10 ?? []).map((j) => {
    const avgLocal = (j.salaryMin + j.salaryMax) / 2;
    const avgUSD = toUSD(avgLocal, currency);
    const takeHomeUSD = Math.round(avgUSD * (1 - totalDeductionRate));
    const colAdjustedUSD = adjustedSalary(takeHomeUSD, c.code);
    const takeHomeLocal = Math.round(avgLocal * (1 - totalDeductionRate));
    const colAdjustedLocal = Math.round(colAdjustedUSD * fxRate);
    return { ...j, avgLocal, avgUSD, takeHomeLocal, colAdjustedLocal, currency };
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Take-Home Pay", item: `${siteUrl}/take-home-pay` },
      { "@type": "ListItem", position: 3, name: `Take-Home Pay in ${c.name}`, item: pageUrl },
    ],
  };

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    name: `Take-Home Pay in ${c.name}`,
    description: `Take-home pay and tax breakdown chart for ${c.name} showing after-tax salary estimates for ${year}.`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(pageUrl, c.name, taxRate)) }} />
      <TrackingRedirect />
      <Header />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Take-Home Pay in {c.name} ({year})
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Estimated tax rate: {Math.round(taxRate * 100)}% &middot; Updated for {year}
            </p>
          </div>
          <div className="mt-4">
            <ShareButtons title={`Take-Home Pay in ${c.name} ${year}`} />
          </div>
        </div>

        <section className="mt-8 mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Est. Income Tax Rate</p>
            <p className="text-3xl font-bold text-gray-900">{Math.round(taxRate * 100)}%</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Social Security</p>
            <p className="text-3xl font-bold text-gray-900">6.2%</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Medicare</p>
            <p className="text-3xl font-bold text-gray-900">1.45%</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Total Deductions</p>
            <p className="text-3xl font-bold text-emerald-600">{Math.round(totalDeductionRate * 100)}%</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tax Breakdown for {c.name}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Deduction Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">On 100k {currency}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Income Tax</td>
                  <td className="py-3 px-4 text-right text-gray-700">{Math.round(taxRate * 100)}%</td>
                  <td className="py-3 px-4 text-right text-gray-700">{Intl.NumberFormat("en-US").format(Math.round(100000 * taxRate))} {currency}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Social Security</td>
                  <td className="py-3 px-4 text-right text-gray-700">6.2%</td>
                  <td className="py-3 px-4 text-right text-gray-700">6,200 {currency}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Medicare</td>
                  <td className="py-3 px-4 text-right text-gray-700">1.45%</td>
                  <td className="py-3 px-4 text-right text-gray-700">1,450 {currency}</td>
                </tr>
                <tr className="bg-emerald-50 font-semibold">
                  <td className="py-3 px-4 text-gray-900">Total Deductions</td>
                  <td className="py-3 px-4 text-right text-emerald-700">{Math.round(totalDeductionRate * 100)}%</td>
                  <td className="py-3 px-4 text-right text-emerald-700">{Intl.NumberFormat("en-US").format(Math.round(100000 * totalDeductionRate))} {currency}</td>
                </tr>
                <tr className="bg-emerald-50 font-bold">
                  <td className="py-3 px-4 text-gray-900">Take-Home Pay</td>
                  <td className="py-3 px-4 text-right text-emerald-700">{Math.round((1 - totalDeductionRate) * 100)}%</td>
                  <td className="py-3 px-4 text-right text-emerald-700">{Intl.NumberFormat("en-US").format(Math.round(100000 * (1 - totalDeductionRate)))} {currency}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {top10.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Take-Home Pay by Job in {c.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Job Title</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg. Gross ({currency})</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Take-Home ({currency})</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">COL-Adj. Take-Home ({currency})</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.map((job) => (
                    <tr key={job.rank} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{job.title}</td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {Intl.NumberFormat("en-US").format(Math.round(job.avgLocal))} {job.currency}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                        {Intl.NumberFormat("en-US").format(job.takeHomeLocal)} {job.currency}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {Intl.NumberFormat("en-US").format(job.colAdjustedLocal)} {job.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {data && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Average Take-Home Pay by Category
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg. Gross ({currency})</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Take-Home ({currency})</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Effective Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.filter((cat) => (data.jobs[cat.slug]?.length ?? 0) > 0).map((cat) => {
                    const jobs = data.jobs[cat.slug];
                    const avgLocal = jobs.reduce((s, j) => s + (j.salaryMin + j.salaryMax) / 2, 0) / jobs.length;
                    const avgNetLocal = avgLocal * (1 - totalDeductionRate);
                    const effRate = (avgLocal - avgNetLocal) / avgLocal;
                    return (
                      <tr key={cat.slug} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{cat.name}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{Intl.NumberFormat("en-US").format(Math.round(avgLocal))} {currency}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600">{Intl.NumberFormat("en-US").format(Math.round(avgNetLocal))} {currency}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{Math.round(effRate * 100)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-12 prose prose-sm max-w-none text-gray-700">
          <h2 className="text-xl font-semibold text-gray-900">Take-Home Pay in {c.name} — Overview</h2>
          <p>
            The estimated effective tax rate in {c.name} is <strong>{Math.round(taxRate * 100)}%</strong> based on the cost of living index of {index}%. Combined with Social Security (6.2%) and Medicare (1.45%), your total deductions amount to approximately <strong>{Math.round(totalDeductionRate * 100)}%</strong> of your gross income.
          </p>
          <p>
            For a gross salary of 100,000 {currency}, your estimated take-home pay would be approximately{" "}
            <strong>{Intl.NumberFormat("en-US").format(Math.round(100000 * (1 - totalDeductionRate)))} {currency}</strong>{" "}
            per year, or about <strong>{Intl.NumberFormat("en-US").format(Math.round(100000 * (1 - totalDeductionRate) / 12))} {currency}</strong> per month.
          </p>
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
            Cost of Living in {c.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            See how far your salary goes in {c.name} and compare purchasing power across categories.
          </p>
          <Link
            href={`/cost-of-living-${c.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            Cost of Living in {c.name}
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
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">What is the take-home pay in {c.name}?</summary>
              <div className="px-5 pb-4 text-sm text-gray-500">The take-home pay in {c.name} depends on your gross salary. After income tax ({Math.round(taxRate * 100)}%), Social Security (6.2%), and Medicare (1.45%), you keep approximately {Math.round((1 - totalDeductionRate) * 100)}% of your gross income.</div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">How are taxes calculated in {c.name}?</summary>
              <div className="px-5 pb-4 text-sm text-gray-500">Tax calculations include income tax, Social Security contributions (6.2%), Medicare (1.45%), and other deductions. The effective tax rate of {Math.round(taxRate * 100)}% is estimated based on the cost of living index.</div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">What is the difference between gross and net salary?</summary>
              <div className="px-5 pb-4 text-sm text-gray-500">Gross salary is your total compensation before deductions. Net salary (take-home pay) is what you receive after income tax, Social Security, Medicare, and other deductions. For a gross salary of 100,000 {currency}, you keep approximately {Intl.NumberFormat("en-US").format(Math.round(100000 * (1 - totalDeductionRate)))} {currency} after all deductions.</div>
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
            Tax estimates are based on standard deduction rates and may vary based on individual circumstances. Social Security (6.2%) and Medicare (1.45%) are based on U.S. rates. Consult a tax professional for accurate advice.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
