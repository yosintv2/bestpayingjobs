import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCountries, getCategories, getCountryBySlug, getCountryJobs } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import CountryCompare from "@/components/CountryCompare";

interface Props {
  params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parts = pair.split("-vs-");
  if (parts.length !== 2) return {};
  const c1 = getCountryBySlug(parts[0]);
  const c2 = getCountryBySlug(parts[1]);
  if (!c1 || !c2) return {};

  return {
    title: `${c1.name} vs ${c2.name} Salary Comparison ${new Date().getFullYear()}`,
    description: `Compare salaries between ${c1.name} and ${c2.name} across 31 career categories. See which country pays more for AI, Engineering, Healthcare, and more.`,
    alternates: {
      canonical: `https://www.bestpayingjobs.net/compare/${pair}`,
    },
    openGraph: {
      title: `${c1.name} vs ${c2.name} Salary Comparison`,
      description: `Compare salaries between ${c1.name} and ${c2.name} across 31 career categories.`,
      url: `https://www.bestpayingjobs.net/compare/${pair}`,
    },
  };
}

export default async function ComparePairPage({ params }: Props) {
  const { pair } = await params;
  const parts = pair.split("-vs-");
  if (parts.length !== 2) redirect("/compare");

  const c1 = getCountryBySlug(parts[0]);
  const c2 = getCountryBySlug(parts[1]);
  if (!c1 || !c2) redirect("/compare");

  const countries = getCountries();
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{c1.name} vs {c2.name}: Salary Comparison</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Compare salary ranges across all career categories between {c1.name} and {c2.name}.
          </p>
        </div>
      </section>
      <section className="py-12 bg-white flex-1">
        <div className="mx-auto max-w-6xl px-6">
          <CountryCompare countries={countries} categories={categories} initialSlug1={c1.slug} initialSlug2={c2.slug} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
