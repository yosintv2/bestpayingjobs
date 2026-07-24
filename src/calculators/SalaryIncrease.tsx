"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function SalaryIncrease() {
  const [current, setCurrent] = useState("60000");
  const [increaseType, setIncreaseType] = useState<"percent" | "amount">("percent");
  const [percent, setPercent] = useState("8");
  const [amount, setAmount] = useState("5000");
  const c = Math.max(0, parseFloat(current) || 0);
  const p = Math.max(0, parseFloat(percent) || 0);
  const amt = Math.max(0, parseFloat(amount) || 0);
  const increase = increaseType === "percent" ? c * p / 100 : amt;
  const newSalary = c + increase;
  const actualPercent = c > 0 ? (increase / c) * 100 : 0;
  const monthlyIncrease = increase / 12;
  return (
    <CalculatorShell title="Salary Increase / Raise Calculator" subtitle="Calculate Your Raise Amount & New Salary" description="Determine the impact of a raise. Enter your current salary and either percentage increase or dollar amount to see your new salary and the difference." faqs={calculatorFaqs["salary-increase"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary ($)</label>
            <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Increase Type</label>
            <select value={increaseType} onChange={e => setIncreaseType(e.target.value as any)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="percent">Percentage (%)</option>
              <option value="amount">Dollar Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{increaseType === "percent" ? "Raise Percentage (%)" : "Raise Amount ($)"}</label>
            <input type="number" value={increaseType === "percent" ? percent : amount} onChange={e => increaseType === "percent" ? setPercent(e.target.value) : setAmount(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {c > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Raise Results</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">New Salary</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(newSalary).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-green-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Increase Amount</p>
                <p className="text-2xl font-bold text-green-600">+${Math.round(increase).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Increase</p>
                <p className="text-2xl font-bold text-emerald-600">+${Math.round(monthlyIncrease).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Percentage Increase</p>
                <p className="text-2xl font-bold text-emerald-600">{actualPercent.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
