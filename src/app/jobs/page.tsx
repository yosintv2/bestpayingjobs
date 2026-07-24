import Link from "next/link";
import { getCountries, getCategories, getCurrentYear } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategorySalaries } from "@/lib/category-stats";
import { formatAnnual } from "@/lib/salary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Paying Jobs by Career Category 2026",
  description:
    "Browse the highest paying jobs across 31 career categories in 195 countries. Compare salaries in Finance, AI, Healthcare, Engineering, and more.",
  openGraph: {
    title: "Best Paying Jobs by Career Category 2026",
    description:
      "Browse the highest paying jobs across 31 career categories in 195 countries.",
  },
};

export default function JobsIndex() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();
  const salaryData = getCategorySalaries();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Jobs by Career Category</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore the highest paying jobs across {categories.length} career fields in {countries.length} countries.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const stats = salaryData[cat.slug];
              const topSalary = stats ? stats.avgMaxSalary : 0;
              const topCountry = stats ? stats.topCountry : "";
              return (
                <Link
                  key={cat.slug}
                  href={`/jobs/${cat.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d={cat.icon} /></svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {cat.description.replace(/\{country\}/g, "your country")}
                  </p>
                  {stats && (
                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                      <span className="text-gray-400">
                        Avg. top salary:{" "}
                        <span className="font-semibold text-emerald-600">
                          {formatAnnual(stats.avgMaxSalary)}
                        </span>
                      </span>
                      <span className="text-gray-400">
                        Top:{" "}
                        <span className="font-medium text-gray-600">{topCountry}</span>
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
