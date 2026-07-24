"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function FireCalculator() {
  const [salary, setSalary] = useState("85000");
  const [savingsRate, setSavingsRate] = useState("30");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [withdrawalRate, setWithdrawalRate] = useState("4");
  const s = Math.max(0, parseFloat(salary) || 0);
  const sr = Math.max(1, parseFloat(savingsRate) || 30) / 100;
  const cs = Math.max(0, parseFloat(currentSavings) || 0);
  const ar = Math.max(0.1, parseFloat(annualReturn) || 7) / 100;
  const wr = Math.max(0.5, parseFloat(withdrawalRate) || 4) / 100;
  const annualSavings = s * sr;
  const annualExpenses = s * (1 - sr);
  const fireNumber = annualExpenses / wr;
  let years = 0;
  let portfolio = cs;
  if (annualSavings > 0 && portfolio < fireNumber) {
    const monthlyRate = ar / 12;
    const monthlySavings = annualSavings / 12;
    const needed = fireNumber;
    years = Math.log((monthlySavings + monthlyRate * needed) / (monthlySavings + monthlyRate * portfolio)) / Math.log(1 + monthlyRate) / 12;
    years = Math.max(0, Math.ceil(years));
  }
  const coastFire = fireNumber / Math.pow(1 + ar, years > 0 ? years : 1);
  const isFireAchieved = portfolio >= fireNumber;
  return (
    <CalculatorShell title="Salary-Based FIRE Calculator" subtitle="Calculate Your Financial Independence Number" description="Use the 4% rule to estimate how long until you can retire based on your salary, savings rate, and investments." faqs={calculatorFaqs["fire-calculator"]}>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your FIRE Number</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">FIRE Number (25x Expenses)</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(fireNumber).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Years to FI</p>
                <p className={`text-2xl font-bold ${isFireAchieved ? "text-green-500" : "text-emerald-600"}`}>
                  {isFireAchieved ? "✓ Achieved" : years > 50 ? "50+" : years}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual Expenses</p>
                <p className="text-2xl font-bold text-gray-700">${Math.round(annualExpenses).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual Savings</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(annualSavings).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Withdrawal rate: {withdrawalRate}% &middot; Expected return: {annualReturn}%</p>
              <p>Monthly savings needed: ${Math.round(annualSavings / 12).toLocaleString()} &middot; Monthly expenses: ${Math.round(annualExpenses / 12).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
