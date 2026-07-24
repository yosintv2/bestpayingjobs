import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCountries,
  getCountryBySlug,
  getCurrentYear,
  hasCountryJobs,
} from "@/lib/db";
import { getPartTimeJobs, getConfig } from "@/lib/part-time";
import { seededShuffle } from "@/lib/shuffle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartTimeJobs from "@/components/PartTimeJobs";
import ShareButtons from "@/components/ShareButtons";
import posts from "@/data/blog-posts.json";

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
  const jobs = getPartTimeJobs(c.code, c.currency);
  const top3 = jobs.slice(0, 3).map((j) => j.title).join(", ");
  const cfg = getConfig();

  const resolve = (tpl: string) =>
    tpl
      .replace(/\{country\}/g, c.name)
      .replace(/\{year\}/g, String(year))
      .replace(/\{top3\}/g, top3)
      .replace(/\{currency\}/g, c.currency);

  const metaImage = {
    url: `https://www.bestpayingjobs.net/og/${c.slug}.webp`,
    width: 1200,
    height: 750,
    alt: `Part-time jobs in ${c.name} for international students`,
  };

  return {
    title: resolve(cfg.metaTitle),
    description: resolve(cfg.metaDescription),
    alternates: {
      canonical: `https://www.bestpayingjobs.net/part-time-jobs-in-${c.slug}`,
    },
    openGraph: {
      title: resolve(cfg.metaTitle),
      description: resolve(cfg.metaDescription),
      images: [metaImage],
    },
  };
}

export default async function PartTimeJobsPage({ params }: Props) {
  const { slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) notFound();

  const year = getCurrentYear();
  const countries = getCountries();
  const jobs = getPartTimeJobs(c.code, c.currency);
  const cfg = getConfig();

  const resolve = (tpl: string) =>
    tpl
      .replace(/\{country\}/g, c.name)
      .replace(/\{year\}/g, String(year))
      .replace(/\{currency\}/g, c.currency);

  const siteUrl = "https://www.bestpayingjobs.net";
  const pageUrl = `${siteUrl}/part-time-jobs-in-${c.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: resolve(cfg.breadcrumbLabel),
        item: pageUrl,
      },
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
      name: `Top 10 Part-Time Jobs in ${c.name}`,
      itemListElement: jobs.map((job) => ({
        "@type": "ListItem",
        position: job.rank,
        item: {
          "@type": "JobPosting",
          title: job.title,
          description: job.description,
          employmentType: "PART_TIME",
          estimatedSalary: {
            "@type": "MonetaryAmount",
            currency: c.currency,
            value: job.monthlySalary,
          },
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressCountry: c.name },
          },
        },
      })),
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <Link
            href={`/best-paying-jobs-in-${c.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            View Full-Time Jobs in {c.name}
          </Link>
          <div className="mb-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Part-Time Jobs in {c.name} ({year})
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              For International Students &middot; Hourly rates in {c.currency} &middot; Updated for {year}
            </p>
          </div>
          <div className="mt-4">
            <ShareButtons
              title={`Part-Time Jobs in ${c.name} for International Students ${year}`}
              url={pageUrl}
            />
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        {jobs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 10 Highest Paying Part-Time Jobs in {c.name}
            </h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
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
                    {Intl.NumberFormat("en-US").format(job.hourlyRate)} {c.currency}/hr &middot; {Intl.NumberFormat("en-US").format(job.monthlySalary)} {c.currency}/month &middot; {job.weeklyHours} hrs/week
                  </p>
                  <p className="text-sm text-gray-500 ml-10 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <PartTimeJobs
          jobs={jobs}
          currency={c.currency}
          countryName={c.name}
          year={year}
          countrySlug={c.slug}
        />

        <section className="mb-12 rounded-xl border border-gray-200 bg-white px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Explore More About Jobs in {c.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Find full-time career opportunities, salary data, and job market insights for {c.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/best-paying-jobs-in-${c.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Full-Time Jobs in {c.name}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/salary-in-${c.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              Salary Data for {c.name}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        <div className="mb-12 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={`/og/${c.slug}.webp`}
            alt={`Best paying jobs in ${c.name} — top careers and salaries`}
            title={`Highest paying jobs and salary data for ${c.name}`}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
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
            ).slice(0, 12)
              .map((oc) => (
                <Link
                  key={oc.code}
                  href={`/part-time-jobs-in-${oc.slug}`}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-3 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
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
