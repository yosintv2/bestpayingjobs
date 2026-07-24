import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountries, getCountryJobs, getCountryByCode, getCategories, getCurrentYear } from "@/lib/db";
import { getCityBySlug, cityMultiplier } from "@/lib/city";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getCities } = await import("@/lib/city");
  return getCities().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  const year = getCurrentYear();
  return {
    title: `Best Paying Jobs in ${city.name}, ${city.countryName} ${year}`,
    description: `Discover the highest paying jobs in ${city.name}, ${city.countryName} for ${year}. Compare salaries across 30+ career categories.`,
    alternates: {
      canonical: `https://www.bestpayingjobs.net/salary-in-${slug}`,
    },
    openGraph: {
      title: `Best Paying Jobs in ${city.name}, ${city.countryName} ${year}`,
      description: `Discover the highest paying jobs in ${city.name}, ${city.countryName} for ${year}.`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const year = getCurrentYear();
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const country = getCountryByCode(city.code);
  if (!country) notFound();

  const data = getCountryJobs(city.code);
  if (!data) notFound();

  const categories = getCategories();
  const multiplier = cityMultiplier(city.type);

  const scaled = (min: number, max: number) => ({
    salaryMin: Math.round(min * multiplier),
    salaryMax: Math.round(max * multiplier),
  });

  const top10 = data.top10.slice(0, 10).map((j) => ({
    ...j,
    ...scaled(j.salaryMin, j.salaryMax),
  }));

  const activeCategories = categories.filter((cat) => (data.jobs[cat.slug]?.length ?? 0) > 0);

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://www.bestpayingjobs.net/og/${city.countrySlug}.webp`,
    name: `Best Paying Jobs in ${city.name}, ${city.countryName}`,
    description: `Salary chart showing top paying jobs in ${city.name}, ${city.countryName}.`,
    representativeOfPage: true,
    thumbnail: { "@type": "ImageObject", contentUrl: `https://www.bestpayingjobs.net/og/${city.countrySlug}.webp`, width: 1200, height: 750 },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
            Best Paying Jobs in {city.name}, {city.countryName} ({year})
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Currency: {data.currency} &middot; {city.type === "capital" ? "Capital city" : "Major city"} &middot; Salaries estimated from national data
          </p>
          <div className="mt-4">
            <ShareButtons title={`Best Paying Jobs in ${city.name}, ${city.countryName} ${year}`} />
          </div>
        </div>

        {top10.length > 0 && (
          <section className="mt-10 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 10 Highest Paying Jobs in {city.name}
            </h2>
            <div className="space-y-4">
              {top10.map((job) => (
                <div key={job.rank} className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0">
                      {job.rank}
                    </span>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600 ml-10 mb-2">
                    Salary Range: from {Intl.NumberFormat("en-US").format(job.salaryMin)} {data.currency} to {Intl.NumberFormat("en-US").format(job.salaryMax)} {data.currency}
                  </p>
                  <p className="text-sm text-gray-500 ml-10">{job.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mb-12 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={`/og/${city.countrySlug}.webp`}
            alt={`Best paying jobs in ${city.name}, ${city.countryName}`}
            title={`Salary data for ${city.name}, ${city.countryName}`}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Jump to Job Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat) => (
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

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Job Categories in {city.name}
          </h2>
          <div className="space-y-3">
            {activeCategories.map((cat) => {
              const jobs = data.jobs[cat.slug]!.map((j) => ({
                ...j,
                ...scaled(j.salaryMin, j.salaryMax),
              }));
              return (
                <div key={cat.slug} id={cat.slug} className="border border-gray-200 rounded-lg overflow-hidden">
                  <Link
                    href={`/jobs/${cat.slug}`}
                    className="block bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 hover:from-emerald-500 hover:to-emerald-600 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d={cat.icon} /></svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            Highest Paying Jobs in {cat.name} in {city.name} {year}
                          </h3>
                          <p className="text-xs text-emerald-100 mt-0.5">
                            {jobs.length} roles in {city.name}
                          </p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-emerald-100 shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-100">
                      {jobs.map((job) => (
                        <li key={job.rank} className="px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0">{job.rank}</span>
                            <span className="text-sm text-gray-700">{job.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 shrink-0 ml-3">
                            {data.currency} {Intl.NumberFormat("en-US").format(job.salaryMin)} – {Intl.NumberFormat("en-US").format(job.salaryMax)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Want the full picture?</h2>
          <p className="text-sm text-gray-500 mb-4">
            View complete salary data for all categories and jobs across {city.countryName}.
          </p>
          <Link
            href={`/best-paying-jobs-in-${city.countrySlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            View All Jobs in {city.countryName}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </main>
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
