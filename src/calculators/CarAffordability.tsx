"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function CarAffordability() {
  const [salary, setSalary] = useState("70000");
  const [takeHomePercent, setTakeHomePercent] = useState("85");
  const [carPercent, setCarPercent] = useState("10");
  const [interestRate, setInterestRate] = useState("6");
  const [loanTerm, setLoanTerm] = useState("60");
  const s = Math.max(0, parseFloat(salary) || 0);
  const thp = Math.max(1, parseFloat(takeHomePercent) || 85) / 100;
  const cp = Math.max(1, parseFloat(carPercent) || 10) / 100;
  const ir = Math.max(0.1, parseFloat(interestRate) || 6) / 100 / 12;
  const lt = parseInt(loanTerm) || 60;
  const monthlyTakeHome = (s / 12) * thp;
  const monthlyCarBudget = monthlyTakeHome * cp;
  const maxCarPrice = monthlyCarBudget * (Math.pow(1 + ir, lt) - 1) / (ir * Math.pow(1 + ir, lt));
  const totalInterest = maxCarPrice * ir * lt;
  return (
    <CalculatorShell title="How Much Car Can I Afford Based on Salary?" subtitle="Car Affordability Calculator" description="Determine a realistic car budget based on your income. Financial experts recommend keeping total car costs under 10-15% of monthly take-home pay." faqs={calculatorFaqs["car-affordability"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Budget % of Take-Home</label>
            <select value={carPercent} onChange={e => setCarPercent(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="10">10% (Conservative)</option>
              <option value="12.5">12.5% (Moderate)</option>
              <option value="15">15% (Aggressive)</option>
              <option value="20">20% (Stretch)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {maxCarPrice > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Car Affordability</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Max Car Price</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(maxCarPrice).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(monthlyCarBudget).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Take-Home</p>
                <p className="text-2xl font-bold text-gray-700">${Math.round(monthlyTakeHome).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Loan Term</p>
                <p className="text-2xl font-bold text-gray-700">{lt} months</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
