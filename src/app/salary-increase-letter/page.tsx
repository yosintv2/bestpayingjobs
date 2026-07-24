import Link from "next/link";
import { getCountries, getCategories, getCurrentYear } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import letters from "@/data/salary-letters.json";

export default function SalaryIncreaseLetterIndex() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Salary Increase Letters</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            24 professionally crafted salary increase letter templates for every situation. Copy, customize, and send.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {letters.map((letter, i) => (
              <Link
                key={letter.id}
                href={`/salary-increase-letter/${letter.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{letter.title}</h2>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{letter.summary}</p>
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
