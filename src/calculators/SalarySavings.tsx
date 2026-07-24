"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function SalarySavings() {
  const [salary, setSalary] = useState("80000");
  const [savingsRate, setSavingsRate] = useState("15");
  const [currentSavings, setCurrentSavings] = useState("20000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("3500");
  const [returnRate, setReturnRate] = useState("7");
  const s = Math.max(0, parseFloat(salary) || 0);
  const sr = Math.max(0, parseFloat(savingsRate) || 15) / 100;
  const cs = Math.max(0, parseFloat(currentSavings) || 0);
  const me = Math.max(0, parseFloat(monthlyExpenses) || 0);
  const rr = Math.max(0, parseFloat(returnRate) || 7) / 100;
  const monthlySavings = (s / 12) * sr;
  const annualSavings = s * sr;
  const monthlyAfterExpenses = (s / 12) - me;
  const savingsRateAfterExpenses = (s / 12) > 0 ? (monthlyAfterExpenses / (s / 12)) * 100 : 0;
  const projected1 = cs + annualSavings;
  const projected5 = cs * Math.pow(1 + rr, 5) + annualSavings * ((Math.pow(1 + rr, 5) - 1) / rr);
  const projected10 = cs * Math.pow(1 + rr, 10) + annualSavings * ((Math.pow(1 + rr, 10) - 1) / rr);
  const projected20 = cs * Math.pow(1 + rr, 20) + annualSavings * ((Math.pow(1 + rr, 20) - 1) / rr);
  return (
    <CalculatorShell title="Salary Savings Calculator" subtitle="How Much Can You Save Based on Your Salary?" description="Project your savings growth over time based on your salary, savings rate, and current investments." faqs={calculatorFaqs["salary-savings"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Savings Rate (%)</label>
            <input type="number" step="1" value={savingsRate} onChange={e => setSavingsRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Savings ($)</label>
            <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {s > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Savings Projections (at {returnRate}% annual return)</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual Savings</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(annualSavings).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Savings</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(monthlySavings).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">In 5 Years</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(projected5).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">In 10 Years</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(projected10).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">In 20 years (estimated): ${Math.round(projected20).toLocaleString()} &middot; Savings rate: {savingsRate}% of gross income</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
