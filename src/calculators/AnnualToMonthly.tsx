"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function AnnualToMonthly() {
  const [annual, setAnnual] = useState("75000");
  const a = Math.max(0, parseFloat(annual) || 0);
  const monthly = a / 12;
  const biWeekly = a / 26;
  const weekly = a / 52;
  const daily = a / 260;
  return (
    <CalculatorShell title="Annual Salary to Monthly Salary Calculator" subtitle="Break Down Yearly Pay into Monthly Figures" description="Our Annual Salary to Monthly Salary Calculator breaks down your yearly income into monthly, bi-weekly, and weekly figures." faqs={calculatorFaqs["annual-to-monthly"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
          <input type="number" value={annual} onChange={e => setAnnual(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        {a > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(monthly).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Bi-Weekly</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(biWeekly).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Weekly</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(weekly).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Daily (260 days)</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(daily).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
