import type { Metadata } from "next";
import { getCountries, getCategories } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountryCompare from "@/components/CountryCompare";

export const metadata: Metadata = {
  title: "Compare Salaries Between Countries 2026",
  description:
    "Compare salaries across 31 career categories between any two countries. Make data-driven decisions about where to work and earn more.",
  openGraph: {
    title: "Compare Salaries Between Countries 2026",
    description:
      "Compare salaries across 31 career categories between any two countries.",
  },
};

export default function ComparePage() {
  const countries = getCountries();
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare Salaries by Country</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Select two countries to compare salary ranges across all career categories.
          </p>
        </div>
      </section>
      <section className="py-12 bg-white flex-1">
        <div className="mx-auto max-w-6xl px-6">
          <CountryCompare countries={countries} categories={categories} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
