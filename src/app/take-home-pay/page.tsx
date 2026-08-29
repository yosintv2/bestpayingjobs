import Link from "next/link";
import type { Metadata } from "next";
import { getCountries, getCountryJobs, getCurrentYear, CURRENT_YEAR } from "@/lib/db";
import { toUSD } from "@/lib/salary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";

const siteUrl = "https://www.bestpayingjobs.net";

const thpTitle = `Take-Home Pay by Country ${CURRENT_YEAR} | BestPayingJobs.net`;

export const metadata: Metadata = {
  title: thpTitle,
  description: "Compare estimated take-home pay after taxes across 195 countries. See salary after tax and net pay for every country worldwide.",
  keywords: [
    "take home pay by country",
    "salary after tax",
    "net pay by country",
    "after tax salary comparison",
    "tax rates by country",
  ],
  alternates: {
    canonical: `${siteUrl}/take-home-pay`,
  },
  openGraph: {
    title: thpTitle,
    description: "Compare estimated take-home pay after taxes across 195 countries.",
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 750,
        alt: "Take-Home Pay by Country",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: thpTitle,
    description: "Compare estimated take-home pay after taxes across 195 countries.",
    images: ["/og/default.webp"],
  },
};

export default function TakeHomePayIndex() {
  const year = getCurrentYear();
  const countries = getCountries().filter((c) => getCountryJobs(c.code));

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
              { "@type": "ListItem", position: 2, name: "Take-Home Pay", item: `${siteUrl}/take-home-pay` },
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
            name: `Take-Home Pay by Country ${year}`,
            description: `Compare estimated take-home pay after taxes across ${countries.length} countries.`,
            url: `${siteUrl}/take-home-pay`,
          }),
        }}
      />
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Take-Home Pay by Country ({year})
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Compare estimated take-home pay after taxes across {countries.length} countries. See how much of your salary you keep in every country.
          </p>
        </div>
      </section>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((c) => {
            const data = getCountryJobs(c.code)!;
            const allSalaries: number[] = [];
            for (const jobs of Object.values(data.jobs)) {
              for (const j of jobs) allSalaries.push(j.salaryMin, j.salaryMax);
            }
            const avgLocal = allSalaries.reduce((a, b) => a + b, 0) / allSalaries.length;
            const avgUsd = toUSD(avgLocal, data.currency);
            const estNetUsd = avgUsd - avgUsd * 0.25;
            const takeHomePct = Math.round((estNetUsd / avgUsd) * 100);
            return (
              <Link
                key={c.code}
                href={`/take-home-pay/${c.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FlagImage slug={c.slug} name={c.name} className="w-8 h-8 rounded-sm shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ~{takeHomePct}% take-home &middot; Avg ${Math.round(avgUsd).toLocaleString()} USD
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
