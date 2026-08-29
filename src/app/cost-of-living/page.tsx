import Link from "next/link";
import type { Metadata } from "next";
import { getCountries, getCurrentYear, CURRENT_YEAR } from "@/lib/db";
import colData from "@/data/col-index.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";

const colIndex = colData as Record<string, number>;

const siteUrl = "https://www.bestpayingjobs.net";

const colTitle = `Cost of Living by Country ${CURRENT_YEAR} | BestPayingJobs.net`;

export const metadata: Metadata = {
  title: colTitle,
  description: "Compare cost of living indexes across 195 countries. See how salaries and purchasing power compare in every country worldwide.",
  keywords: [
    "cost of living index",
    "cost of living by country",
    "COL index comparison",
    "country living expenses",
    "purchasing power by country",
  ],
  alternates: {
    canonical: `${siteUrl}/cost-of-living`,
  },
  openGraph: {
    title: colTitle,
    description: "Compare cost of living indexes across 195 countries.",
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 750,
        alt: "Cost of Living by Country",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: colTitle,
    description: "Compare cost of living indexes across 195 countries.",
    images: ["/og/default.webp"],
  },
};

export default function CostOfLivingIndex() {
  const year = getCurrentYear();
  const countries = getCountries().filter((c) => c.code in colIndex);

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
              { "@type": "ListItem", position: 2, name: "Cost of Living", item: `${siteUrl}/cost-of-living` },
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
            name: `Cost of Living by Country ${year}`,
            description: `Compare cost of living indexes across ${countries.length} countries.`,
            url: `${siteUrl}/cost-of-living`,
          }),
        }}
      />
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cost of Living by Country ({year})
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Compare cost of living indexes across {countries.length} countries. See how far your salary goes in every country worldwide.
          </p>
        </div>
      </section>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((c) => {
            const index = colIndex[c.code];
            const cheaper = index < 100;
            const diffPct = Math.round(Math.abs(1 - index / 100) * 100);
            return (
              <Link
                key={c.code}
                href={`/cost-of-living/${c.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FlagImage slug={c.slug} name={c.name} className="w-8 h-8 rounded-sm shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Index: {index} &middot; {diffPct}% {cheaper ? "below" : "above"} NYC
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
