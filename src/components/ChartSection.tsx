"use client";

import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import CountrySalaryChart from "./CountrySalaryChart";
import ShareButtons from "./ShareButtons";

interface JobData {
  rank: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
}

export default function ChartSection({
  jobs,
  currency,
  countryName,
  countrySlug,
}: {
  jobs: JobData[];
  currency: string;
  countryName: string;
  countrySlug: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${countrySlug}-salary-chart.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download chart", err);
    }
  }, [countrySlug]);

  const shareUrl = `https://www.bestpayingjobs.net/best-paying-jobs-in-${countrySlug}`;
  const shareTitle = `Top 10 Highest Paying Jobs in ${countryName} 2026 | BestPayingJobs.net`;

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Salary Overview — Top 10 Jobs
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Monthly salary in {currency} &middot; BestPayingJobs.net
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButtons url={shareUrl} title={shareTitle} />
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
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 relative"
      >
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] text-gray-300 font-medium tracking-wider select-none pointer-events-none">
          BestPayingJobs.net
        </div>
        <CountrySalaryChart jobs={jobs} currency={currency} />
      </div>
    </section>
  );
}
