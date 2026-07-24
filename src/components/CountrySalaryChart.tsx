"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface JobData {
  rank: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
}

const fmt = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toLocaleString();
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-200 shadow-lg text-xs sm:text-sm">
      <p className="font-semibold text-gray-900 mb-1 sm:mb-1.5">{d.title}</p>
      <div className="space-y-0.5 text-gray-600">
        <p className="flex justify-between gap-4 sm:gap-6">
          <span>Min</span>
          <span className="font-medium text-gray-900">{fmt(d.min)}</span>
        </p>
        <p className="flex justify-between gap-4 sm:gap-6">
          <span>Average</span>
          <span className="font-medium text-emerald-600">{fmt(d.avg)}</span>
        </p>
        <p className="flex justify-between gap-4 sm:gap-6">
          <span>Max</span>
          <span className="font-medium text-gray-900">{fmt(d.max)}</span>
        </p>
      </div>
    </div>
  );
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

export default function CountrySalaryChart({
  jobs,
  currency,
}: {
  jobs: JobData[];
  currency: string;
}) {
  const isMobile = useIsMobile();

  const data = jobs
    .map((j) => ({
      title: j.title,
      min: j.salaryMin,
      max: j.salaryMax,
      avg: Math.round((j.salaryMin + j.salaryMax) / 2),
    }))
    .sort((a, b) => b.avg - a.avg);

  const maxVal = data[0]?.max ?? 1;

  return (
    <div className="w-full h-[420px] sm:h-[480px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 6, right: 6, left: isMobile ? 6 : 20, bottom: 6 }}
          barSize={isMobile ? 18 : 24}
        >
          <XAxis
            type="number"
            domain={[0, maxVal * 1.15]}
            tick={{ fontSize: isMobile ? 9 : 11, fill: "#9ca3af" }}
            tickFormatter={fmt}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            interval={isMobile ? 1 : 0}
          />
          <YAxis
            type="category"
            dataKey="title"
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#374151", fontWeight: 500 }}
            width={isMobile ? 110 : 200}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0fdf4" }} />
          <Bar
            dataKey="avg"
            fill="#059669"
            radius={[0, 6, 6, 0]}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
