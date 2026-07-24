"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toUSD, formatAnnual } from "@/lib/salary";
import type { Country, Category, CountryJobs } from "@/lib/db";

export default function CountryCompare({
  countries,
  categories,
  initialSlug1 = "",
  initialSlug2 = "",
}: {
  countries: Country[];
  categories: Category[];
  initialSlug1?: string;
  initialSlug2?: string;
}) {
  const router = useRouter();
  const [slug1, setSlug1] = useState(initialSlug1);
  const [slug2, setSlug2] = useState(initialSlug2);
  const [data1, setData1] = useState<CountryJobs | null>(null);
  const [data2, setData2] = useState<CountryJobs | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLocal, setShowLocal] = useState(false);

  const c1 = useMemo(() => countries.find((c) => c.slug === slug1) ?? null, [slug1]);
  const c2 = useMemo(() => countries.find((c) => c.slug === slug2) ?? null, [slug2]);

  async function loadCountry(slug: string, setter: (d: CountryJobs | null) => void) {
    if (!slug) { setter(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${slug}`);
      if (res.ok) setter(await res.json());
      else setter(null);
    } catch { setter(null); }
    setLoading(false);
  }

  useEffect(() => {
    if (initialSlug1) loadCountry(initialSlug1, setData1);
    if (initialSlug2) loadCountry(initialSlug2, setData2);
  }, []);

  function updateUrl(s1: string, s2: string) {
    if (s1 && s2) {
      router.push(`/compare/${s1}-vs-${s2}`, { scroll: false });
    }
  }

  function handleSelect1(slug: string) {
    setSlug1(slug);
    loadCountry(slug, setData1);
    updateUrl(slug, slug2);
  }

  function handleSelect2(slug: string) {
    setSlug2(slug);
    loadCountry(slug, setData2);
    updateUrl(slug1, slug);
  }

  function fmtVal(usd: number, local: number, cur: string) {
    if (showLocal) return `${cur} ${Math.round(local / 1000)}k`;
    return formatAnnual(usd);
  }

  const comparisons = useMemo(() => {
    if (!data1 || !data2 || !c1 || !c2) return [];
    return categories
      .map((cat) => {
        const jobs1 = data1.jobs[cat.slug] ?? [];
        const jobs2 = data2.jobs[cat.slug] ?? [];
        const avg1USD = jobs1.length
          ? Math.round(jobs1.reduce((s, j) => s + toUSD(j.salaryMax, data1.currency), 0) / jobs1.length)
          : 0;
        const avg2USD = jobs2.length
          ? Math.round(jobs2.reduce((s, j) => s + toUSD(j.salaryMax, data2.currency), 0) / jobs2.length)
          : 0;
        const avg1Local = jobs1.length
          ? Math.round(jobs1.reduce((s, j) => s + j.salaryMax, 0) / jobs1.length)
          : 0;
        const avg2Local = jobs2.length
          ? Math.round(jobs2.reduce((s, j) => s + j.salaryMax, 0) / jobs2.length)
          : 0;
        return { cat, avg1USD, avg2USD, avg1Local, avg2Local, winner: avg1USD > avg2USD ? 1 : avg2USD > avg1USD ? 2 : 0, diff: Math.abs(avg1USD - avg2USD) };
      })
      .filter((c) => c.avg1USD > 0 || c.avg2USD > 0)
      .sort((a, b) => Math.max(b.avg1USD, b.avg2USD) - Math.max(a.avg1USD, a.avg2USD));
  }, [data1, data2, c1, c2, categories]);

  const maxSalary = useMemo(
    () => Math.max(...comparisons.flatMap((c) => [c.avg1USD, c.avg2USD]), 1),
    [comparisons]
  );

  const summary = useMemo(() => {
    const w1 = comparisons.filter((c) => c.winner === 1).length;
    const w2 = comparisons.filter((c) => c.winner === 2).length;
    const tie = comparisons.filter((c) => c.winner === 0).length;
    const avg1 = comparisons.length ? Math.round(comparisons.reduce((s, c) => s + c.avg1USD, 0) / comparisons.length) : 0;
    const avg2 = comparisons.length ? Math.round(comparisons.reduce((s, c) => s + c.avg2USD, 0) / comparisons.length) : 0;
    const avg1L = comparisons.length ? Math.round(comparisons.reduce((s, c) => s + c.avg1Local, 0) / comparisons.length) : 0;
    const avg2L = comparisons.length ? Math.round(comparisons.reduce((s, c) => s + c.avg2Local, 0) / comparisons.length) : 0;
    return { w1, w2, tie, avg1, avg2, avg1L, avg2L, total: comparisons.length };
  }, [comparisons]);

  const biggestGap = useMemo(() => {
    if (comparisons.length === 0) return null;
    return comparisons.reduce((a, b) => (a.diff > b.diff ? a : b));
  }, [comparisons]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <select
            value={slug1}
            onChange={(e) => handleSelect1(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Select country 1...</option>
            {countries.map((c) => (
              <option key={c.code} value={c.slug} disabled={c.slug === slug2}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">{c1?.flag ?? "🇺🇳"}</span>
        </div>
        <button
          onClick={() => { if (slug1 && slug2) { handleSelect1(slug2); handleSelect2(slug1); } }}
          disabled={!slug1 || !slug2}
          className="shrink-0 w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Swap countries"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
        </button>
        <div className="flex-1 relative">
          <select
            value={slug2}
            onChange={(e) => handleSelect2(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Select country 2...</option>
            {countries.map((c) => (
              <option key={c.code} value={c.slug} disabled={c.slug === slug1}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">{c2?.flag ?? "🇺🇳"}</span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && (!slug1 || !slug2) && (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <p className="text-gray-400 text-sm">Select two countries above to compare salaries</p>
        </div>
      )}

      {!loading && slug1 && slug2 && comparisons.length === 0 && (
        <div className="text-center py-16 text-gray-400">No salary data available for this comparison.</div>
      )}

      {comparisons.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Salary Overview</h2>
            <button
              onClick={() => setShowLocal(!showLocal)}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-600 transition-all"
            >
              {showLocal ? "Show in USD" : `Show in local currency`}
            </button>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 mb-8 text-white">
            <div className="text-xs text-emerald-100 font-medium uppercase tracking-wider mb-4">Average Salary Across All Categories</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xl">{c1?.flag}</span>
                  <span className="text-sm font-medium text-emerald-100">{c1?.name}</span>
                </div>
                <div className="text-3xl font-bold">{fmtVal(summary.avg1, summary.avg1L, data1?.currency ?? "")}</div>
                {showLocal && <div className="text-sm text-emerald-200 mt-0.5">{formatAnnual(summary.avg1)} USD</div>}
              </div>
              <div className="text-center sm:text-right sm:border-l sm:border-emerald-500/30 sm:pl-6">
                <div className="flex items-center justify-center sm:justify-end gap-2 mb-1">
                  <span className="text-xl">{c2?.flag}</span>
                  <span className="text-sm font-medium text-emerald-100">{c2?.name}</span>
                </div>
                <div className="text-3xl font-bold">{fmtVal(summary.avg2, summary.avg2L, data2?.currency ?? "")}</div>
                {showLocal && <div className="text-sm text-emerald-200 mt-0.5">{formatAnnual(summary.avg2)} USD</div>}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-emerald-500/30">
              <div className="h-2.5 bg-emerald-500/30 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-white rounded-l-full transition-all" style={{ width: `${(summary.avg1 / (summary.avg1 + summary.avg2)) * 100}%` }} />
                  <div className="bg-emerald-300 rounded-r-full transition-all" style={{ width: `${(summary.avg2 / (summary.avg1 + summary.avg2)) * 100}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-xs text-emerald-200 mt-1.5">
                <span>{c1?.name}: {Math.round((summary.avg1 / (summary.avg1 + summary.avg2)) * 100)}%</span>
                <span>{c2?.name}: {Math.round((summary.avg2 / (summary.avg1 + summary.avg2)) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 text-center">
              <div className="text-2xl font-bold text-emerald-600">{summary.w1}</div>
              <div className="text-xs text-emerald-700 mt-1 font-medium">{c1?.name} leads</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center">
              <div className="text-2xl font-bold text-gray-900">{summary.tie}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Tied</div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 text-center">
              <div className="text-2xl font-bold text-emerald-600">{summary.w2}</div>
              <div className="text-xs text-emerald-700 mt-1 font-medium">{c2?.name} leads</div>
            </div>
          </div>

          {biggestGap && biggestGap.diff > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-8 flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <div className="text-sm text-amber-800">
                <span className="font-semibold">Biggest gap:</span> {biggestGap.cat.name} — {biggestGap.winner === 1 ? c1?.name : c2?.name} pays <strong>{formatAnnual(biggestGap.diff)}/yr</strong> more
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
            <div className="space-y-3">
              {comparisons.map(({ cat, avg1USD, avg2USD, avg1Local, avg2Local, winner, diff }) => {
                const bar1 = (avg1USD / maxSalary) * 100;
                const bar2 = (avg2USD / maxSalary) * 100;
                return (
                  <div key={cat.slug} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-emerald-200 transition-colors">
                    <div className="px-5 py-3.5 bg-gray-50 flex items-center gap-2.5 border-b border-gray-100">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d={cat.icon} /></svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                      {winner !== 0 && (
                        <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700`}>
                          +{formatAnnual(diff)} in {winner === 1 ? c1?.name : c2?.name}
                        </span>
                      )}
                    </div>
                    <div className="px-5 py-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-base">{c1?.flag}</span>
                              <span className="font-medium text-gray-700">{c1?.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${winner === 1 ? "text-emerald-600" : "text-gray-500"}`}>{fmtVal(avg1USD, avg1Local, data1?.currency ?? "")}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${winner === 1 ? "bg-emerald-600" : "bg-gray-300"}`}
                              style={{ width: `${Math.max(bar1, 1)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-base">{c2?.flag}</span>
                              <span className="font-medium text-gray-700">{c2?.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${winner === 2 ? "text-emerald-600" : "text-gray-500"}`}>{fmtVal(avg2USD, avg2Local, data2?.currency ?? "")}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${winner === 2 ? "bg-emerald-600" : "bg-gray-300"}`}
                              style={{ width: `${Math.max(bar2, 1)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
