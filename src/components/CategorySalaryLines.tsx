"use client";

import type { Job } from "@/lib/db";

const fmt = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toLocaleString();
};

export default function CategorySalaryLines({
  jobs,
  currency,
}: {
  jobs: Job[];
  currency: string;
}) {
  const data = jobs
    .map((j) => ({
      title: j.title,
      min: j.salaryMin,
      max: j.salaryMax,
      avg: Math.round((j.salaryMin + j.salaryMax) / 2),
    }))
    .sort((a, b) => b.avg - a.avg);

  const globalMax = data[0]?.max ?? 1;

  return (
    <div className="border-t border-gray-200 px-5 py-4 bg-gray-50/50">
      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-3">
        Salary range by job
      </div>
      <div className="space-y-2.5">
        {data.map((d) => {
          const pct = Math.max((d.avg / globalMax) * 100, 3);
          return (
            <div key={d.title} className="flex items-center gap-2.5">
              <span
                className="text-[11px] text-gray-600 w-[120px] shrink-0 truncate"
                title={d.title}
              >
                {d.title}
              </span>
              <div className="flex-1 relative h-[14px]">
                <div className="absolute inset-y-1/2 left-0 -translate-y-1/2 w-full h-px bg-gray-200" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 border border-white rounded-full shadow-sm"
                  style={{ left: `calc(${pct}% - 4px)` }}
                />
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold w-14 text-right shrink-0">
                {fmt(d.avg)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
