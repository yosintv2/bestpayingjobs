"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PartTimeJob } from "@/lib/part-time";
import ShareButtons from "./ShareButtons";

const fmt = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toLocaleString();
};

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white px-3 py-2.5 rounded-xl border border-gray-200 shadow-lg text-xs">
      <p className="font-semibold text-gray-900 mb-1">{d.title}</p>
      <div className="space-y-0.5 text-gray-600">
        <p className="flex justify-between gap-4">
          <span>Hourly</span>
          <span className="font-medium text-emerald-600">{fmt(d.hourlyRate)}/hr</span>
        </p>
        <p className="flex justify-between gap-4">
          <span>Monthly</span>
          <span className="font-medium text-gray-900">{fmt(d.monthlySalary)}</span>
        </p>
        <p className="text-[10px] text-gray-400">{d.weeklyHours} hrs/week</p>
      </div>
    </div>
  );
};

export default function PartTimeJobs({
  jobs,
  currency,
  countryName,
  year,
  countrySlug,
}: {
  jobs: PartTimeJob[];
  currency: string;
  countryName: string;
  year: number;
  countrySlug: string;
}) {
  const [copied, setCopied] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  if (jobs.length === 0) return null;

  const chartData = [...jobs].sort((a, b) => b.monthlySalary - a.monthlySalary);
  const maxSalary = chartData[0]?.monthlySalary ?? 1;

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${countrySlug}-part-time-jobs.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download chart", err);
    }
  }, [countrySlug]);

  const handleCopy = useCallback(() => {
    const text = jobs
      .map(
        (j) =>
          `${j.rank}. ${j.title} — ${fmt(j.monthlySalary)} ${currency}/mo (${fmt(j.hourlyRate)}/hr, ${j.weeklyHours} hrs/week)`
      )
      .join("\n");
    navigator.clipboard.writeText(
      `Top 10 Part-Time Jobs in ${countryName} for International Students (${year})\n${text}\n\nSource: BestPayingJobs.net`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [jobs, currency, countryName, year]);

  const shareUrl = `https://www.bestpayingjobs.net/part-time-jobs-in-${countrySlug}`;
  const shareTitle = `Part-Time Jobs in ${countryName} for International Students ${year} | BestPayingJobs.net`;

  return (
    <section id="parttimejobs" className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            10 Highest Paying Part-time Jobs in {countryName} for International Students ({year})
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {jobs[0]?.weeklyHours ?? 20} hours per week &middot; Monthly salary in {currency} &middot; BestPayingJobs.net
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButtons url={shareUrl} title={shareTitle} />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shrink-0"
            title="Copy data to clipboard"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shrink-0"
            title="Download chart as image"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <div
        ref={chartRef}
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-5 relative"
      >
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] text-gray-300 font-medium tracking-wider select-none pointer-events-none">
          BestPayingJobs.net
        </div>
        <div className="w-full h-[400px] sm:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 6, right: 10, left: 6, bottom: 6 }}
              barSize={20}
            >
              <XAxis
                type="number"
                domain={[0, maxSalary * 1.2]}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(v: number) => {
                  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
                  return v.toLocaleString();
                }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fontSize: 11, fill: "#374151", fontWeight: 500 }}
                width={150}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f0fdf4" }} />
              <Bar
                dataKey="monthlySalary"
                fill="#059669"
                radius={[0, 6, 6, 0]}
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
