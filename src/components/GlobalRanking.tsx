"use client";

import { useState } from "react";
import { formatAnnual } from "@/lib/salary";

interface JobRank {
  title: string;
  avgUSD: number;
  adjustedAvg: number;
  countryCount: number;
  categoryLinks: string[];
}

export default function GlobalRankingClient({ jobs, total }: { jobs: JobRank[]; total: number }) {
  const [showAdjusted, setShowAdjusted] = useState(false);

  const ranked = showAdjusted
    ? [...jobs].sort((a, b) => b.adjustedAvg - a.adjustedAvg)
    : jobs;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{total} careers ranked</p>
        <button
          onClick={() => setShowAdjusted(!showAdjusted)}
          className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-600 transition-all"
        >
          {showAdjusted ? "Show raw USD" : "Adjusted for cost of living"}
        </button>
      </div>
      <div className="space-y-3">
        {ranked.map((job, i) => {
          const displayVal = showAdjusted ? job.adjustedAvg : job.avgUSD;
          return (
            <div
              key={job.title}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 text-sm font-bold text-white">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-900 truncate">{job.title}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                  <span>{job.countryCount} countries</span>
                  {job.categoryLinks.map((name) => (
                    <span key={name} className="text-emerald-600">{name}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <div className="text-sm font-bold text-emerald-600">{formatAnnual(displayVal)}</div>
                <div className="text-[11px] text-gray-400">{showAdjusted ? "COL adjusted" : "global avg"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
