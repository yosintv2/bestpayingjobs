"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function RentAffordability() {
  const [salary, setSalary] = useState("65000");
  const [monthlyDebts, setMonthlyDebts] = useState("300");
  const [rule, setRule] = useState("30");
  const s = Math.max(0, parseFloat(salary) || 0);
  const md = Math.max(0, parseFloat(monthlyDebts) || 0);
  const r = Math.max(1, parseFloat(rule) || 30);
  const monthlyGross = s / 12;
  const maxRent = monthlyGross * r / 100;
  const maxRentAfterDebt = Math.max(0, (monthlyGross * 0.43) - md);
  const affordableRent = Math.min(maxRent, maxRentAfterDebt);
  return (
    <CalculatorShell title="How Much Rent Can I Afford Based on Salary?" subtitle="Rent Affordability Calculator by Income" description="Find your ideal rent range using the standard 30% rule. Enter your annual salary and monthly debts." faqs={calculatorFaqs["rent-affordability"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Debt Payments ($)</label>
            <input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent-to-Income Rule</label>
            <select value={rule} onChange={e => setRule(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="30">30% (Conservative)</option>
              <option value="35">35% (Moderate)</option>
              <option value="40">40% (Aggressive)</option>
              <option value="50">50% (High Cost Area)</option>
            </select>
          </div>
        </div>
        {s > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Rent Budget</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Max Monthly Rent</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(affordableRent).toLocaleString()}/mo</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Max Annual Rent</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(affordableRent * 12).toLocaleString()}/yr</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Gross Income</p>
                <p className="text-2xl font-bold text-gray-700">${Math.round(monthlyGross).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Debt-to-Income Ratio</p>
                <p className="text-2xl font-bold text-gray-700">{monthlyGross > 0 ? ((md / monthlyGross) * 100).toFixed(1) : "0"}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
