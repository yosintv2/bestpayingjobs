"use client";

import { useState } from "react";
import type { Job, Category } from "@/lib/db";
import JobCard from "./JobCard";

export default function CategoryAccordion({
  category,
  jobs,
  currency,
  year,
  countryName,
  countrySlug,
}: {
  category: Category;
  jobs: Job[];
  currency: string;
  year: number;
  countryName: string;
  countrySlug: string;
}) {
  const [showImage, setShowImage] = useState(false);

  if (jobs.length === 0) return null;

  return (
    <section id={category.slug} className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <span className="text-sm font-bold text-white">Highest Paying Jobs in {category.name} in {countryName} {year}</span>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-100">
          {jobs.map((job) => (
            <JobCard key={`${category.slug}-${job.rank}`} job={job} currency={currency} />
          ))}
        </ul>
      </div>
      <button
        onClick={() => setShowImage(!showImage)}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white border-t border-gray-200 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
      >
        <svg className={`w-4 h-4 transition-transform ${showImage ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        {showImage ? `Hide ${category.name} Data in Image` : `Show ${category.name} Data in Image`}
      </button>
      <div
        className={`border-t border-gray-200 overflow-hidden transition-all duration-300 ${showImage ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <img
          src={`/og/${countrySlug}/categories/${category.slug}.webp`}
          alt={`Highest paying ${category.name} jobs in ${countryName}`}
          title={`${category.name} salary data for ${countryName}`}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    </section>
  );
}
