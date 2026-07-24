"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function Bonus() {
  const [bonus, setBonus] = useState("10000");
  const [salary, setSalary] = useState("80000");
  const [state, setState] = useState("None (TX, FL, etc)");
  const b = Math.max(0, parseFloat(bonus) || 0);
  const s = Math.max(0, parseFloat(salary) || 0);
  const stateRates: Record<string, number> = { "None (TX, FL, etc)": 0, "California": 0.093, "New York": 0.0685, "Illinois": 0.0495, "Pennsylvania": 0.0307 };
  const federalWithholding = b * 0.22;
  const stateWithholding = b * (stateRates[state] || 0.05);
  const ss = Math.min(s + b, 168600) * 0.062 - Math.min(s, 168600) * 0.062;
  const mc = b * 0.0145;
  const totalWithheld = federalWithholding + stateWithholding + Math.max(0, ss) + mc;
  const takeHome = Math.max(0, b - totalWithheld);
  return (
    <CalculatorShell title="Bonus Calculator" subtitle="Estimate Your Bonus Pay After Tax" description="Estimate your take-home bonus after federal and state withholding. Bonuses are typically taxed at a flat supplemental rate of 22% federal." faqs={calculatorFaqs.bonus}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Amount ($)</label>
            <input type="number" value={bonus} onChange={e => setBonus(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
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
        </div>
        {b > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bonus Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Take-Home Bonus</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(takeHome).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-red-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Withheld</p>
                <p className="text-2xl font-bold text-red-500">${Math.round(totalWithheld).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-amber-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Effective Tax Rate</p>
                <p className="text-2xl font-bold text-amber-600">{b > 0 ? ((totalWithheld / b) * 100).toFixed(1) : "0"}%</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Federal (22% supplemental): <span className="font-semibold text-gray-900">${Math.round(federalWithholding).toLocaleString()}</span></p>
              <p>State: <span className="font-semibold text-gray-900">${Math.round(stateWithholding).toLocaleString()}</span></p>
              <p>Social Security: <span className="font-semibold text-gray-900">${Math.round(Math.max(0, ss)).toLocaleString()}</span></p>
              <p>Medicare: <span className="font-semibold text-gray-900">${Math.round(mc).toLocaleString()}</span></p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
