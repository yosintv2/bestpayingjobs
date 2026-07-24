import Link from "next/link";
import type { Metadata } from "next";
import { getCountries, getCurrentYear } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlagImage from "@/components/FlagImage";

export const metadata: Metadata = {
  title: "Part-Time Jobs for International Students 2026 | BestPayingJobs",
  description: "Discover the highest paying part-time jobs for international students in 195 countries. Compare part-time salaries, hourly rates, and job opportunities worldwide.",
};

export default function PartTimeJobsIndex() {
  const year = getCurrentYear();
  const countries = getCountries();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Part-Time Jobs for International Students ({year})
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore the highest paying part-time jobs for international students in {countries.length} countries. Compare hourly rates, monthly salaries, and find the best student job opportunities worldwide.
          </p>
        </div>
      </section>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/part-time-jobs-in-${c.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <FlagImage slug={c.slug} name={c.name} className="w-8 h-8 rounded-sm shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Part-time jobs in {c.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
