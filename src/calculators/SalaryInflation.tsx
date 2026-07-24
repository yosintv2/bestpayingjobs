"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function SalaryInflation() {
  const [salary, setSalary] = useState("80000");
  const [years, setYears] = useState("5");
  const [inflationRate, setInflationRate] = useState("3");
  const s = Math.max(0, parseFloat(salary) || 0);
  const y = Math.max(1, parseFloat(years) || 5);
  const r = Math.max(0.1, parseFloat(inflationRate) || 3) / 100;
  const adjustedSalary = s * Math.pow(1 + r, y);
  const purchasingPower = s / Math.pow(1 + r, y);
  const totalLoss = adjustedSalary - s;
  return (
    <CalculatorShell title="Salary Inflation Calculator" subtitle="Adjust Your Salary for Inflation Over Time" description="See how inflation affects your salary's purchasing power. Enter your salary, years, and expected inflation rate." faqs={calculatorFaqs["salary-inflation"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Inflation Rate (%)</label>
            <input type="number" step="0.1" value={inflationRate} onChange={e => setInflationRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {s > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inflation Impact</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Salary Needed in {y} Years</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(adjustedSalary).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-red-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Future Purchasing Power</p>
                <p className="text-2xl font-bold text-red-500">${Math.round(purchasingPower).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Current Salary</p>
                <p className="text-2xl font-bold text-gray-700">${Math.round(s).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-amber-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Inflation</p>
                <p className="text-2xl font-bold text-amber-600">{((Math.pow(1 + r, y) - 1) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
