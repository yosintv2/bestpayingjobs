import type { Metadata } from "next";
import { getCountries, getCategories, getCountryJobs, getCurrentYear } from "@/lib/db";
import { toUSD, formatAnnual, adjustedSalary } from "@/lib/salary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalRankingClient from "@/components/GlobalRanking";

export const metadata: Metadata = {
  title: "Highest Paying Jobs in the World 2026 — Top 100 Global Careers",
  description:
    "Discover the top 100 highest paying jobs in the world for 2026. Compare global salary averages across 195 countries. See which careers pay the most.",
  openGraph: {
    title: "Highest Paying Jobs in the World 2026",
    description:
      "Discover the top 100 highest paying jobs in the world for 2026.",
  },
};

export default function GlobalRankingPage() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();
  const catNameMap = new Map(categories.map((c) => [c.slug, c.name]));

  const titleMap = new Map<string, { salaries: number[]; codes: string[]; countries: Set<string>; categories: Set<string> }>();

  for (const country of countries) {
    const data = getCountryJobs(country.code);
    if (!data) continue;
    for (const [catSlug, jobs] of Object.entries(data.jobs)) {
      for (const job of jobs) {
        const usd = toUSD(job.salaryMax, data.currency);
        if (!titleMap.has(job.title)) {
          titleMap.set(job.title, { salaries: [], codes: [], countries: new Set(), categories: new Set() });
        }
        const entry = titleMap.get(job.title)!;
        entry.salaries.push(usd);
        entry.codes.push(country.code);
        entry.countries.add(country.name);
        entry.categories.add(catSlug);
      }
    }
  }

  const jobs = [...titleMap.entries()]
    .map(([title, info]) => ({
      title,
      avgUSD: Math.round(info.salaries.reduce((a, b) => a + b, 0) / info.salaries.length),
      adjustedAvg: info.codes.length
        ? Math.round(info.codes.reduce((s, code, i) => s + adjustedSalary(info.salaries[i], code), 0) / info.codes.length)
        : Math.round(info.salaries.reduce((a, b) => a + b, 0) / info.salaries.length),
      countryCount: info.countries.size,
      categoryLinks: [...info.categories].map((s) => catNameMap.get(s)).filter(Boolean).slice(0, 2) as string[],
    }))
    .sort((a, b) => b.avgUSD - a.avgUSD)
    .slice(0, 100);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Highest Paying Jobs in the World ({year})</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Top 100 careers ranked by global average salary across all {countries.length} countries and {categories.length} categories.
          </p>
        </div>
      </section>
      <section className="py-12 bg-white flex-1">
        <div className="mx-auto max-w-5xl px-6">
          <GlobalRankingClient jobs={jobs} total={jobs.length} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
