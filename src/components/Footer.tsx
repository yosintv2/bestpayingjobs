import Link from "next/link";
import { getCountries, getCategories, getCurrentYear, getCountryJobs } from "@/lib/db";
import { toUSD } from "@/lib/salary";
import FlagImage from "@/components/FlagImage";

export default function Footer() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();

  const topCountries = countries
    .map((c) => {
      const data = getCountryJobs(c.code);
      if (!data) return null;
      const allSalaries = Object.values(data.jobs).flat().map((j) => toUSD(j.salaryMax, data.currency));
      const avg = allSalaries.reduce((a, b) => a + b, 0) / allSalaries.length;
      return { ...c, avgUSD: avg };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.avgUSD - a.avgUSD)
    .slice(0, 5);

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-base font-bold text-gray-900">BestPayingJobs</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">Salary comparison data for 195 countries across 31 career categories.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Home</Link></li>
              <li><Link href="/jobs" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Categories</Link></li>
              <li><Link href="/salary-increase-letter" className="text-sm text-emerald-600 font-medium">Salary Letters</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Top Countries</h4>
            <ul className="space-y-3">
              {topCountries.map((c) => (
                <li key={c.code}><Link href={`/best-paying-jobs-in-${c.slug}`} className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"><FlagImage slug={c.slug} name={c.name} className="w-5 h-5 inline-block rounded-sm mr-1.5 -mt-0.5" />{c.name}</Link></li>
              ))}
              <li><Link href="/" className="text-sm text-emerald-600 font-medium hover:underline">View all &rarr;</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
            <ul className="space-y-3">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}><Link href={`/jobs/${cat.slug}`} className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{cat.name}</Link></li>
              ))}
              <li><Link href="/jobs" className="text-sm text-emerald-600 font-medium hover:underline">View all &rarr;</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">&copy; {year} BestPayingJobs.net &mdash; Best Paying Jobs in Every Country</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
