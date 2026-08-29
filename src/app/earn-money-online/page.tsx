import Link from "next/link";
import type { Metadata } from "next";
import { getCountries, getCurrentYear } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";
import emData from "@/data/earn-money-online.json";

const data = emData as unknown as { methods: { rank: number; title: string; category: string; difficulty: string }[] };

export const metadata: Metadata = {
  title: `Earn Money Online — ${data.methods.length} Ways in ${getCountries().length} Countries | BestPayingJobs`,
  description: `Discover ${data.methods.length} proven ways to earn money online in ${getCountries().length} countries. Compare earning potential, timeframes, platforms, and local currency estimates worldwide.`,
  keywords: [
    "earn money online",
    "work from home",
    "online income",
    "freelance jobs",
    "remote work opportunities",
    "make money online",
  ],
  alternates: {
    canonical: "https://www.bestpayingjobs.net/earn-money-online",
  },
  openGraph: {
    title: `Earn Money Online — ${data.methods.length} Ways in ${getCountries().length} Countries`,
    description: `Discover ${data.methods.length} proven ways to earn money online in ${getCountries().length} countries.`,
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 750,
        alt: "Earn Money Online Worldwide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Earn Money Online — ${data.methods.length} Ways in ${getCountries().length} Countries`,
    description: `Discover ${data.methods.length} proven ways to earn money online in ${getCountries().length} countries.`,
    images: ["/og/default.webp"],
  },
};

export default function EarnMoneyOnlineIndex() {
  const year = getCurrentYear();
  const countries = getCountries();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-6">
            {data.methods.length} Proven Methods &middot; {countries.length} Countries
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Earn Money Online
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-10">
            Discover {data.methods.length} proven ways to earn money online in {countries.length} countries.
            Compare earning potential in local currency, estimated time to first payout, and platforms to get started.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Browse by Country
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {countries.map((c) => (
              <Link
                key={c.code}
                href={`/earn-money-online/${c.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FlagImage slug={c.slug} name={c.name} className="w-8 h-8 rounded-sm shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Earn money online in {c.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
