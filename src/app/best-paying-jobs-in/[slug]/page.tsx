import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCountries,
  getCountryBySlug,
  getCategories,
  getCountryJobs,
  getCurrentYear,
  hasCountryJobs,
} from "@/lib/db";
import CategoryAccordion from "@/components/CategoryAccordion";
import ChartSection from "@/components/ChartSection";
import FlagImage from "@/components/FlagImage";
import TrackingRedirect from "@/components/TrackingRedirect";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import posts from "@/data/blog-posts.json";
import { getCitiesByCountry } from "@/lib/city";
import { seededShuffle } from "@/lib/shuffle";
import { occupationListSchema, occupationSchema, faqPageSchema } from "@/lib/schema";
import { countryKeywords } from "@/lib/keywords";

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
  const data = getCountryJobs(c.code);
  const year = getCurrentYear();
  const top3 = data?.top10?.slice(0, 3).map((j) => j.title).join(", ") ?? "";

  const metaImage = {
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    width: 1200,
    height: 750,
    alt: `Best paying jobs in ${c.name} — top careers and salaries`,
  };

  return {
    title: `Best Paying Jobs in ${c.name} ${year} | BestPayingJobs.net`,
    description: `Discover the highest paying jobs in ${c.name} for ${year}. Top careers include ${top3}. Compare salaries across 30+ career categories in ${c.name}.`,
    keywords: countryKeywords({
      country: c.name,
      year,
      currency: data?.currency ?? c.currency,
      topJobs: data?.top10?.slice(0, 3).map((j) => j.title) ?? [],
      categories: getCategories()
        .filter((cat) => (data?.jobs[cat.slug]?.length ?? 0) > 0)
        .slice(0, 2)
        .map((cat) => cat.name),
    }),
    alternates: {
      canonical: `https://www.bestpayingjobs.net/best-paying-jobs-in-${c.slug}`,
    },
    openGraph: {
      title: `Best Paying Jobs in ${c.name} ${year} | BestPayingJobs.net`,
      description: `Discover the highest paying jobs in ${c.name} for ${year}. Compare salaries across 30+ categories.`,
      url: `https://www.bestpayingjobs.net/best-paying-jobs-in-${c.slug}`,
      images: [metaImage],
    },
    twitter: {
      title: `Best Paying Jobs in ${c.name} ${year} | BestPayingJobs.net`,
      description: `Discover the highest paying jobs in ${c.name} for ${year}. Compare salaries across 30+ categories.`,
      card: "summary_large_image",
      images: [metaImage],
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) notFound();

  const data = getCountryJobs(c.code);
  const year = getCurrentYear();
  const categories = getCategories();
  const countries = getCountries();

  const top10 = data?.top10 ?? [];

  const siteUrl = "https://www.bestpayingjobs.net";
  const pageUrl = `${siteUrl}/best-paying-jobs-in-${c.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: `Best Paying Jobs in ${c.name}`,
        item: pageUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best Paying Jobs in ${c.name} ${year}`,
    description: `Discover the highest paying jobs in ${c.name} for ${year}. Compare salaries across 30+ career categories in ${c.name}.`,
    url: pageUrl,
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    mainEntity: occupationListSchema(top10, data?.currency ?? c.currency, c.name),
  };

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    name: `Best Paying Jobs in ${c.name}`,
    description: `Salary chart showing the top 10 highest paying jobs and their salary ranges in ${c.name} for ${year}.`,
    representativeOfPage: true,
    thumbnail: {
      "@type": "ImageObject",
      contentUrl: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
      width: 1200,
      height: 750,
    },
  };

  const categoryItemLists = categories
    .filter((cat) => (data?.jobs[cat.slug]?.length ?? 0) > 0)
    .map((cat) => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Highest Paying Jobs in ${cat.name} in ${c.name} ${year}`,
      description: cat.description,
      url: `${pageUrl}#${cat.slug}`,
      itemListElement: data!.jobs[cat.slug].map((job) => ({
        "@type": "ListItem",
        position: job.rank,
        item: occupationSchema(job, data!.currency, c.name),
      })),
    }));

  const cities = getCitiesByCountry(c.code);

  const currency = data?.currency ?? c.currency;
  const fmt = (n: number) => Intl.NumberFormat("en-US").format(n);
  const trackedCategories = categories.filter((cat) => (data?.jobs[cat.slug]?.length ?? 0) > 0).length;

  // One source for both the rendered FAQ and the FAQPage markup — Google
  // requires the structured data to match what the visitor can actually see.
  const faqs = [
    {
      q: `What is the highest paying job in ${c.name}?`,
      a: top10[0]
        ? `The highest paying job in ${c.name} is ${top10[0].title}, with a salary range of ${fmt(top10[0].salaryMin)} to ${fmt(top10[0].salaryMax)} ${currency} per month. It is followed by ${top10[1]?.title ?? "other senior professional roles"}${top10[2] ? ` and ${top10[2].title}` : ""}.`
        : `Salary data for ${c.name} covers multiple career categories. Browse the sections above to find specific job salaries.`,
    },
    {
      q: `How many jobs are tracked in ${c.name}?`,
      a: `We track salaries across ${trackedCategories} career categories in ${c.name}, covering hundreds of individual job titles across every major industry.`,
    },
    {
      q: `What is the average salary in ${c.name}?`,
      a: `Average salaries in ${c.name} vary widely by industry and experience level. Professional and specialist roles typically pay several times the national average, while entry-level positions start considerably lower. Compare across ${categories.length} categories to see where a specific role sits.`,
    },
    {
      q: "How are these salary estimates calculated?",
      a: `Salary data on this page is based on research from the Economic Research Institute (ERI) and SalaryExpert. Figures are estimates and vary with experience, location and industry. Data is reviewed annually to reflect current market conditions.`,
    },
  ];

  const faqSchema = faqPageSchema(faqs);

  // A short, self-contained answer near the top of the page is the format
  // Google most often lifts for a featured snippet.
  const snippetAnswer = top10[0]
    ? `The highest paying job in ${c.name} is ${top10[0].title}, earning between ${fmt(top10[0].salaryMin)} and ${fmt(top10[0].salaryMax)} ${currency} per month. Other top-paying roles include ${top10
        .slice(1, 4)
        .map((j) => j.title)
        .join(", ")}. Salaries below cover ${trackedCategories} career categories in ${c.name}, updated for ${year}.`
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {categoryItemLists.map((schema) => (
        <script
          key={schema.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <TrackingRedirect />
      <Header />

      <section className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0 text-chalk/60 bg-grid mask-fade pointer-events-none" />
        <div
          className="absolute -top-32 left-1/4 w-[34rem] h-[34rem] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.741 0.156 162 / 0.18), transparent 62%)" }}
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 pt-8 pb-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-chalk/45 mb-7">
            <Link href="/" className="hover:text-chalk transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-chalk/75">{c.name}</span>
          </nav>

          <div className="min-w-0">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chalk leading-[1.1]">
              Best Paying Jobs in {c.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-jade/15 text-jade text-xs font-bold">
                {year}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-chalk/10 text-chalk/70 text-xs font-medium">
                Currency: {data?.currency ?? c.currency}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-chalk/10 text-chalk/70 text-xs font-medium">
                {categories.length} categories
              </span>
            </div>
          </div>

          {top10.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-chalk/5 border border-chalk/10 px-4 py-3">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-chalk/45">
                  Top paying role
                </dt>
                <dd className="mt-1 text-sm font-bold text-chalk truncate">{top10[0].title}</dd>
              </div>
              <div className="rounded-xl bg-chalk/5 border border-chalk/10 px-4 py-3">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-chalk/45">
                  Highest salary / month
                </dt>
                <dd className="mt-1 numeric text-sm font-bold text-jade">
                  {Intl.NumberFormat("en-US").format(top10[0].salaryMax)}{" "}
                  {data?.currency ?? c.currency}
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl bg-chalk/5 border border-chalk/10 px-4 py-3">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-chalk/45">
                  Roles tracked
                </dt>
                <dd className="mt-1 numeric text-sm font-bold text-chalk">
                  {Object.values(data?.jobs ?? {}).flat().length.toLocaleString()}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-7">
            <ShareButtons title={`Best Paying Jobs in ${c.name} ${year}`} onDark />
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">

        {snippetAnswer && (
          <p className="text-[17px] leading-relaxed text-gray-700 mb-10 border-l-2 border-emerald-500 pl-5">
            {snippetAnswer}
          </p>
        )}

        {top10.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 10 Highest Paying Jobs in {c.name}
            </h2>

            {/* Ordered list so the ranking is machine-readable, not just visual. */}
            <ol className="space-y-4">
              {top10.map((job) => (
                <li
                  key={job.rank}
                  className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-5"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0">
                      {job.rank}
                    </span>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600 ml-10 mb-2">
                    Monthly salary: {fmt(job.salaryMin)} to {fmt(job.salaryMax)} {currency} per month
                  </p>
                  <p className="text-sm text-gray-500 ml-10">
                    {job.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {top10.length > 0 && (
          <ChartSection
            jobs={top10}
            currency={data?.currency ?? c.currency}
            countryName={c.name}
            countrySlug={c.slug}
          />
        )}

        <div className="mb-12 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={`/og/${c.slug}.webp`}
            alt={`Best paying jobs in ${c.name} — top careers and salaries`}
            title={`Highest paying jobs and salary data for ${c.name}`}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        {cities.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Salary Data by City in {c.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/salary-in-${city.slug}/`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {city.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{city.type} city</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Jump to Job Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-gray-200 bg-white px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            More Resources for {c.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Explore cost of living, take-home pay, and ways to earn money online in {c.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/cost-of-living-${c.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Cost of Living
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/take-home-pay-${c.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              Take-Home Pay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/earn-money-online-${c.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              Earn Online
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card overflow-hidden group open:bg-emerald-50/30">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-gray-900 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                  {f.q}
                  <svg className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Other Countries</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {seededShuffle(
              countries.filter((x) => x.code !== c.code),
              c.code
            ).slice(0, 12)
              .map((oc) => (
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
