"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

const stateRates: Record<string, number> = {
  "None (TX, FL, etc)": 0, "California": 0.093, "New York": 0.0685, "Illinois": 0.0495,
  "Pennsylvania": 0.0307, "Ohio": 0.0399, "Michigan": 0.0425, "Arizona": 0.0259,
  "Colorado": 0.0455, "Georgia": 0.0575, "Maryland": 0.0575, "Massachusetts": 0.05,
  "Minnesota": 0.0798, "New Jersey": 0.0697, "North Carolina": 0.0475, "Oregon": 0.0875,
  "Virginia": 0.0575, "Washington DC": 0.085, "Wisconsin": 0.0765,
};

export default function SalaryAfterTax() {
  const [salary, setSalary] = useState("100000");
  const [state, setState] = useState("None (TX, FL, etc)");
  const [filing, setFiling] = useState("single");
  const [preTax, setPreTax] = useState("8000");
  const s = Math.max(0, parseFloat(salary) || 0);
  const pt = Math.max(0, parseFloat(preTax) || 0);
  const taxable = Math.max(0, s - pt);
  const brackets2025: [number, number][] = filing === "single"
    ? [[0, 0.1], [11925, 0.12], [48475, 0.22], [103350, 0.24], [197300, 0.32], [250525, 0.35], [626350, 0.37]]
    : [[0, 0.1], [23850, 0.12], [96950, 0.22], [206700, 0.24], [394600, 0.32], [501050, 0.35], [751600, 0.37]];
  let federal = 0;
  let prev = 0;
  for (const [bracket, rate] of brackets2025) {
    if (taxable > prev) {
      const chunk = Math.min(taxable, bracket) - prev;
      if (chunk > 0) federal += chunk * rate;
    }
    prev = bracket;
  }
  const stateTax = taxable * (stateRates[state] || 0.05);
  const ss = Math.min(taxable, 168600) * 0.062;
  const mc = taxable * 0.0145;
  const totalTax = federal + stateTax + ss + mc;
  const afterTax = Math.max(0, s - totalTax);
  return (
    <CalculatorShell title="Salary After Tax Calculator" subtitle="See Your Income After Federal & State Taxes" description="Our Salary After Tax Calculator shows exactly how much you keep after taxes, including federal income tax, state tax, FICA, and other deductions." faqs={calculatorFaqs["salary-after-tax"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select value={state} onChange={e => setState(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {Object.keys(stateRates).map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Tax Deductions ($)</label>
            <input type="number" value={preTax} onChange={e => setPreTax(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
            <select value={filing} onChange={e => setFiling(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
        </div>
        {afterTax > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">After-Tax Income</h3>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual After Tax</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(afterTax).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly After Tax</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(afterTax / 12).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Weekly After Tax</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(afterTax / 52).toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Federal Tax: <span className="font-semibold text-gray-900">${Math.round(federal).toLocaleString()}</span></p>
              <p>State Tax: <span className="font-semibold text-gray-900">${Math.round(stateTax).toLocaleString()}</span></p>
              <p>Social Security: <span className="font-semibold text-gray-900">${Math.round(ss).toLocaleString()}</span></p>
              <p>Medicare: <span className="font-semibold text-gray-900">${Math.round(mc).toLocaleString()}</span></p>
              <p className="text-sm text-gray-400 mt-2">Effective tax rate: {s > 0 ? ((totalTax / s) * 100).toFixed(1) : "0"}%</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
