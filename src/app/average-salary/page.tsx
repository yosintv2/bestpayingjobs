import Link from "next/link";
import type { Metadata } from "next";
import { getCountries, getCurrentYear, CURRENT_YEAR } from "@/lib/db";
import { getAverageSalaryData } from "@/lib/average-salary-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";

const siteUrl = "https://www.bestpayingjobs.net";

const avgSalTitle = `Average Salary by Country ${CURRENT_YEAR} | BestPayingJobs.net`;

export const metadata: Metadata = {
  title: avgSalTitle,
  description: "Compare average salaries across 195 countries. See annual and monthly salaries, salary distributions, and cost of living data for every country.",
  keywords: [
    "average salary by country",
    "average income by country",
    "salary comparison",
    "global salary data",
    "average wages worldwide",
  ],
  alternates: {
    canonical: `${siteUrl}/average-salary`,
  },
  openGraph: {
    title: avgSalTitle,
    description: "Compare average salaries across 195 countries.",
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 750,
        alt: "Average Salary by Country",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: avgSalTitle,
    description: "Compare average salaries across 195 countries.",
    images: ["/og/default.webp"],
  },
};

export default function AverageSalaryIndex() {
  const year = getCurrentYear();
  const countries = getCountries().filter((c) => getAverageSalaryData(c.slug));

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Average Salary", item: `${siteUrl}/average-salary` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Average Salary by Country ${year}`,
            description: `Compare average salaries across ${countries.length} countries.`,
            url: `${siteUrl}/average-salary`,
          }),
        }}
      />
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Average Salary by Country ({year})
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Compare average salaries across {countries.length} countries. See annual and monthly salaries, salary distributions, and detailed compensation data.
          </p>
        </div>
      </section>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((c) => {
            const data = getAverageSalaryData(c.slug)!;
            const { averageSalary } = data.data;
            return (
              <Link
                key={c.code}
                href={`/average-salary/${c.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FlagImage slug={c.slug} name={c.name} className="w-8 h-8 rounded-sm shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Intl.NumberFormat("en-US").format(averageSalary.annual)} {c.currency}/yr
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
