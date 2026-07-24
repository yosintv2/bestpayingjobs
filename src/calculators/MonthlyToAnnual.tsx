"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function MonthlyToAnnual() {
  const [monthly, setMonthly] = useState("5000");
  const [payPeriods, setPayPeriods] = useState("12");
  const m = Math.max(0, parseFloat(monthly) || 0);
  const pp = parseInt(payPeriods) || 12;
  const annual = m * pp;
  const weekly = annual / 52;
  const biWeekly = annual / 26;
  const daily = annual / 260;
  return (
    <CalculatorShell title="Monthly Salary to Annual Salary Calculator" subtitle="Convert Monthly Pay to Yearly Income" description="Quickly convert your monthly salary to annual income. Enter your monthly gross income and see projected yearly earnings." faqs={calculatorFaqs["monthly-to-annual"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary ($)</label>
            <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Periods per Year</label>
            <select value={payPeriods} onChange={e => setPayPeriods(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="12">12 (Monthly)</option>
              <option value="26">26 (Bi-Weekly)</option>
              <option value="24">24 (Semi-Monthly)</option>
              <option value="52">52 (Weekly)</option>
            </select>
          </div>
        </div>
        {annual > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Salary Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual Salary</p>
                <p className="text-2xl font-bold text-emerald-600">${annual.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(annual / 12).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Bi-Weekly</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(biWeekly).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Weekly</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(weekly).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
