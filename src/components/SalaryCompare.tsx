"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { flagUrl } from "@/lib/flag";
import type { ComparePayload, CompareCountry } from "@/lib/compare";
import CategoryComparison from "@/components/CategoryComparison";

/* ------------------------------------------------------------------ picker */

function CountryPicker({
  label,
  countries,
  value,
  exclude,
  onChange,
}: {
  label: string;
  countries: CompareCountry[];
  value: CompareCountry;
  exclude?: string;
  onChange: (c: CompareCountry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = countries.filter((c) => c.c !== exclude);
    if (!q) return pool.slice(0, 60);
    const starts: CompareCountry[] = [];
    const contains: CompareCountry[] = [];
    for (const c of pool) {
      const n = c.n.toLowerCase();
      if (n.startsWith(q)) starts.push(c);
      else if (n.includes(q)) contains.push(c);
    }
    return [...starts, ...contains].slice(0, 60);
  }, [query, countries, exclude]);

  // Reset the highlight during render rather than in an effect.
  const [lastQuery, setLastQuery] = useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setActive(0);
  }

  useEffect(() => {
    function onAway(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onAway);
    return () => document.removeEventListener("mousedown", onAway);
  }, []);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function pick(c: CompareCountry) {
    onChange(c);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center gap-3 h-14 px-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-shadow"
      >
        <img
          src={flagUrl(value.s)}
          alt=""
          className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
        />
        <span className="text-[15px] font-semibold text-gray-900 truncate">{value.n}</span>
        <svg className="w-4 h-4 text-gray-400 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full card rounded-2xl shadow-xl shadow-gray-900/10 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search countries…"
              aria-label="Search countries"
              className="w-full h-10 px-3 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No match for “{query}”.</p>
          ) : (
            <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto p-1.5">
              {results.map((c, i) => (
                <li key={c.c} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(c)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      i === active ? "bg-emerald-50" : ""
                    }`}
                  >
                    <img src={flagUrl(c.s)} alt="" loading="lazy" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200 shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">{c.n}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- compare */

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

/**
 * Percentages stop being readable once the gap is large — "2770% higher" is
 * arithmetically right and useless. Past roughly triple, a multiple reads far
 * better, which matters because the widest gaps are the common case here.
 */
function formatGap(higher: number, lower: number): string {
  if (lower <= 0) return "";
  const ratio = higher / lower;
  if (ratio >= 3) {
    const x = ratio >= 10 ? Math.round(ratio) : Math.round(ratio * 10) / 10;
    return `${x}×`;
  }
  return `${Math.round((ratio - 1) * 100)}%`;
}

/* The query string is the source of truth for the selected pair, which makes
   every comparison shareable without a statically generated page per pair.
   Subscribing to it rather than mirroring it into state avoids a second render
   pass on mount and keeps the back button working. */
const urlListeners = new Set<() => void>();

function subscribeToUrl(onChange: () => void) {
  urlListeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    urlListeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

const getUrlSnapshot = () => window.location.search;
/** No query string exists during prerender, so the defaults render server-side. */
const getServerUrlSnapshot = () => "";

function setPairInUrl(aSlug: string, bSlug: string) {
  window.history.replaceState(null, "", `${window.location.pathname}?a=${aSlug}&b=${bSlug}`);
  urlListeners.forEach((l) => l());
}

export default function SalaryCompare({ payload }: { payload: ComparePayload }) {
  const { titles, countries, categories } = payload;

  const byCode = useMemo(() => new Map(countries.map((c) => [c.c, c])), [countries]);
  const bySlug = useMemo(() => new Map(countries.map((c) => [c.s, c])), [countries]);

  const search = useSyncExternalStore(subscribeToUrl, getUrlSnapshot, getServerUrlSnapshot);

  const fallbackA = byCode.get("us") ?? countries[0];
  const fallbackB = byCode.get("in") ?? countries[1] ?? countries[0];

  const { a, b } = useMemo(() => {
    const p = new URLSearchParams(search);
    const pickedA = bySlug.get(p.get("a") ?? "") ?? fallbackA;
    let pickedB = bySlug.get(p.get("b") ?? "") ?? fallbackB;
    if (pickedB.c === pickedA.c) pickedB = pickedA.c === fallbackB.c ? fallbackA : fallbackB;
    return { a: pickedA, b: pickedB };
  }, [search, bySlug, fallbackA, fallbackB]);

  const setA = (c: CompareCountry) => setPairInUrl(c.s, b.s);
  const setB = (c: CompareCountry) => setPairInUrl(a.s, c.s);

  // Ratios are computed from the USD averages so the comparison is currency
  // neutral; only local-currency figures are ever shown.
  const higher = a.avg >= b.avg ? a : b;
  const lower = a.avg >= b.avg ? b : a;
  const absPct = lower.avg > 0 ? Math.abs((higher.avg - lower.avg) / lower.avg) * 100 : 0;
  const gapLabel = formatGap(higher.avg, lower.avg);

  // Purchasing power: nominal pay divided by the local cost of living.
  const ppA = a.col > 0 ? a.avg / (a.col / 100) : 0;
  const ppB = b.col > 0 ? b.avg / (b.col / 100) : 0;
  const ppHigher = ppA >= ppB ? a : b;
  const ppHi = Math.max(ppA, ppB);
  const ppLo = Math.min(ppA, ppB);
  const ppAbs = ppLo > 0 ? Math.abs((ppHi - ppLo) / ppLo) * 100 : 0;
  const ppGapLabel = formatGap(ppHi, ppLo);

  const localAvg = (c: CompareCountry) => c.avg * c.fx;

  function swap() {
    setPairInUrl(b.s, a.s);
  }

  return (
    <div>
      {/* Selectors */}
      <div className="card rim p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-3 items-end">
          <CountryPicker label="Country A" countries={countries} value={a} exclude={b.c} onChange={setA} />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap countries"
            className="h-14 w-14 mx-auto grid place-items-center rounded-xl border border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <CountryPicker label="Country B" countries={countries} value={b} exclude={a.c} onChange={setB} />
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-6 rounded-2xl bg-ink text-chalk p-6 sm:p-8 relative isolate overflow-hidden">
        <div className="absolute inset-0 text-chalk/50 bg-grid mask-fade pointer-events-none" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-wider text-chalk/45">
            Average salary comparison
          </p>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-extrabold leading-tight">
            {absPct < 1 ? (
              <>
                Salaries in {a.n} and {b.n} are{" "}
                <span className="text-jade">about the same</span>
              </>
            ) : (
              <>
                Average salaries in {higher.n} are{" "}
                <span className="text-jade numeric">{gapLabel}</span>{" "}
                {gapLabel.endsWith("×") ? "the level of" : "higher than in"} {lower.n}
              </>
            )}
          </p>
          <p className="mt-4 text-sm text-chalk/60 leading-relaxed max-w-2xl">
            Based on average monthly pay across all tracked roles. Adjusted for what money actually
            buys locally,{" "}
            {ppAbs < 1 ? (
              <>purchasing power is broadly similar in both.</>
            ) : (
              <>
                <strong className="text-chalk">{ppHigher.n}</strong> comes out{" "}
                <span className="numeric text-jade">{ppGapLabel}</span>{" "}
                {ppGapLabel.endsWith("×") ? "further" : ""} ahead.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Side-by-side stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[a, b].map((c) => (
          <div key={c.c} className="card p-6">
            <div className="flex items-center gap-3">
              <img src={flagUrl(c.s)} alt="" className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200" />
              <Link
                href={`/best-paying-jobs-in/${c.s}/`}
                className="font-display text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors"
              >
                {c.n}
              </Link>
            </div>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Average monthly salary
                </dt>
                <dd className="mt-1 numeric text-2xl font-bold text-emerald-600">
                  {fmt(localAvg(c))}{" "}
                  <span className="text-sm font-semibold text-gray-400">{c.cur}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Cost of living index
                </dt>
                <dd className="mt-1 flex items-center gap-3">
                  <span className="numeric text-lg font-bold text-gray-900">{c.col.toFixed(1)}</span>
                  <span className="meter flex-1 max-w-[8rem]">
                    <span style={{ width: `${Math.min(100, c.col)}%` }} />
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Job-by-job */}
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only">
            Highest paying jobs compared between {a.n} and {b.n}, monthly salary ranges in local
            currency
          </caption>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Job title
              </th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right whitespace-nowrap">
                {a.n} ({a.cur}/mo)
              </th>
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right whitespace-nowrap">
                {b.n} ({b.cur}/mo)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {titles.map((title, i) => (
              <tr key={title} className="hover:bg-emerald-50/40 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{title}</td>
                <td className="px-4 py-3 numeric text-sm text-gray-700 text-right whitespace-nowrap">
                  {fmt(a.j[i]?.[0] ?? 0)} &ndash; {fmt(a.j[i]?.[1] ?? 0)}
                </td>
                <td className="px-4 py-3 numeric text-sm text-gray-700 text-right whitespace-nowrap">
                  {fmt(b.j[i]?.[0] ?? 0)} &ndash; {fmt(b.j[i]?.[1] ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 leading-relaxed">
        Each country&rsquo;s figures are shown in its own currency, so columns are not directly
        comparable by eye &mdash; the percentages above handle that conversion. Salary figures are
        monthly estimates.
      </p>

      {/* Full 310-role breakdown, loaded on demand for the selected pair. */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold text-gray-900">
          Every job category compared
        </h2>
        <p className="mt-2 mb-6 text-gray-500 leading-relaxed">
          All {categories.length} career categories and 310 roles in {a.n} and {b.n}, side by side.
          The <span className="font-semibold text-emerald-600">highlighted</span> figure in each row
          is the higher of the two once converted to a common basis.
        </p>
        <CategoryComparison a={a} b={b} categories={categories} />
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/cost-of-living/${a.s}/`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
          Cost of living in {a.n}
        </Link>
        <Link href={`/cost-of-living/${b.s}/`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
          Cost of living in {b.n}
        </Link>
        <Link href={`/take-home-pay/${a.s}/`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
          Take-home pay in {a.n}
        </Link>
        <Link href="/global-ranking/" className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
          Global salary ranking
        </Link>
      </div>
    </div>
  );
}
