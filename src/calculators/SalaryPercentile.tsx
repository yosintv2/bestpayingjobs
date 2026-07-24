"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function SalaryPercentile() {
  const [salary, setSalary] = useState("85000");
  const s = Math.max(0, parseFloat(salary) || 0);
  const percentiles = [25000, 35000, 50000, 65000, 80000, 100000, 120000, 150000, 200000];
  const percentileLabels = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  let pRank = 0;
  for (let i = 0; i < percentiles.length; i++) {
    if (s >= percentiles[i]) pRank = percentileLabels[i];
  }
  if (s >= percentiles[percentiles.length - 1]) pRank = 99;
  const above = percentiles.filter(p => s > p).length;
  const below = percentiles.filter(p => s < p).length;
  const higherCount = percentiles.filter(p => s > p).length;
  return (
    <CalculatorShell title="Salary Percentile Calculator" subtitle="See Where Your Salary Ranks" description="Find your salary percentile ranking compared to US income data. See how your income compares to others." faqs={calculatorFaqs["salary-percentile"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6 max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Annual Salary ($)</label>
          <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        {s > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Percentile Ranking</h3>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-500">
                <span className="text-3xl font-bold text-emerald-600">${Math.round(s / 1000)}k</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Your Salary</p>
                <p className="text-2xl font-bold text-emerald-600">${s.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Estimated Percentile</p>
                <p className="text-2xl font-bold text-emerald-600">{pRank}th</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">You earn more than</p>
                <p className="text-2xl font-bold text-emerald-600">{Math.max(1, higherCount * 10)}%</p>
              </div>
            </div>
            <div className="space-y-2">
              {percentiles.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 w-16">{percentileLabels[i]}th: </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${s >= p ? "bg-emerald-500" : "bg-gray-200"}`} style={{ width: `${(s >= p ? 100 : (s / p) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-20 text-right">${p.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
