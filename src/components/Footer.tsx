import Link from "next/link";
import { getCountries, getCategories, getCurrentYear, getCountryJobs } from "@/lib/db";
import { toUSD } from "@/lib/salary";
import FlagImage from "@/components/FlagImage";
import Logo from "@/components/Logo";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Salaries",
    links: [
      { href: "/jobs/", label: "All categories" },
      { href: "/global-ranking/", label: "Global ranking" },
      { href: "/average-salary/", label: "Average salary" },
      { href: "/cost-of-living/", label: "Cost of living" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/compare/", label: "Compare countries" },
      { href: "/calculator/", label: "Calculators" },
      { href: "/take-home-pay/", label: "Take-home pay" },
      { href: "/salary-increase-letter/", label: "Raise letters" },
    ],
  },
  {
    title: "Earn more",
    links: [
      { href: "/part-time-jobs/", label: "Part-time jobs" },
      { href: "/earn-money-online/", label: "Earn online" },
      { href: "/blog/", label: "Career blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about/", label: "About us" },
      { href: "/contact/", label: "Contact" },
      { href: "/privacy/", label: "Privacy policy" },
      { href: "/terms/", label: "Terms of service" },
      { href: "/disclaimer/", label: "Disclaimer" },
    ],
  },
];

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
    .slice(0, 6);

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-chalk/70">
      <div className="absolute inset-0 text-chalk/40 bg-grid mask-fade pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          <div className="col-span-2">
            <Logo onDark />
            <p className="mt-4 text-sm leading-relaxed max-w-xs text-chalk/55">
              Salary data for {countries.length} countries across {categories.length} career
              categories &mdash; free and updated for {year}.
            </p>

            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-chalk/40 mb-3">
                Top paying countries
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topCountries.map((c) => (
                  <Link
                    key={c.code}
                    href={`/best-paying-jobs-in/${c.slug}/`}
                    title={`Best paying jobs in ${c.name}`}
                    className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border border-chalk/12 text-xs text-chalk/70 hover:border-jade/50 hover:text-chalk transition-colors"
                  >
                    <FlagImage slug={c.slug} name={c.name} className="w-4 h-4 ring-1 ring-chalk/20" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-chalk/40 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-chalk/65 hover:text-jade transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-7 border-t border-chalk/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-chalk/45 text-center sm:text-left">
            &copy; {year} BestPayingJobs.net &mdash; Best paying jobs in every country.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-chalk/45">
            <Link href="/about/" className="hover:text-chalk transition-colors">About</Link>
            <Link href="/contact/" className="hover:text-chalk transition-colors">Contact</Link>
            <Link href="/privacy/" className="hover:text-chalk transition-colors">Privacy</Link>
            <Link href="/terms/" className="hover:text-chalk transition-colors">Terms</Link>
            <Link href="/disclaimer/" className="hover:text-chalk transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
