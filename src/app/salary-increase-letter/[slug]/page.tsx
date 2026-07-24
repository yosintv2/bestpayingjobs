import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountries, getCategories, getCurrentYear } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import letters from "@/data/salary-letters.json";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return letters.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const letter = (letters as Array<{ id: string; title: string; subtitle: string; summary: string }>).find((l) => l.id === slug);
  if (!letter) return {};
  return {
    title: `${letter.title} — Salary Increase Letter`,
    description: letter.summary,
    alternates: {
      canonical: `https://www.bestpayingjobs.net/salary-increase-letter/${slug}`,
    },
  };
}

export default async function SalaryLetterPage({ params }: Props) {
  const { slug } = await params;
  const letter = (letters as Array<{ id: string; title: string; subtitle: string; summary: string; content: string }>).find((l) => l.id === slug);
  if (!letter) notFound();

  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/salary-increase-letter" className="text-sm text-emerald-600 font-medium hover:underline mb-4 inline-block">&larr; All Salary Increase Letters</Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{letter.title}</h1>
          <p className="text-gray-500">{letter.subtitle}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <p className="text-sm text-gray-500 mb-6 italic">{letter.summary}</p>

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>Dear [Manager Name],</p>
              {letter.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="mt-6">Thank you.</p>
              <p>Sincerely,<br />[Your name]<br />[Date]</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/salary-increase-letter"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              &larr; All Letters
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Browse Salaries
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
