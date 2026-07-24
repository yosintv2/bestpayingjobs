"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function Commission() {
  const [base, setBase] = useState("40000");
  const [salesVolume, setSalesVolume] = useState("500000");
  const [rate, setRate] = useState("5");
  const b = Math.max(0, parseFloat(base) || 0);
  const sv = Math.max(0, parseFloat(salesVolume) || 0);
  const r = Math.max(0, parseFloat(rate) || 0);
  const commission = sv * r / 100;
  const total = b + commission;
  const monthlyTotal = total / 12;
  const monthlyCommission = commission / 12;
  return (
    <CalculatorShell title="Commission Calculator" subtitle="Calculate Your Commission Earnings" description="Calculate total earnings for sales professionals. Enter your base salary, commission rate, and sales volume." faqs={calculatorFaqs.commission}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary ($/yr)</label>
            <input type="number" value={base} onChange={e => setBase(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Sales Volume ($)</label>
            <input type="number" value={salesVolume} onChange={e => setSalesVolume(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
            <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {total > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Earnings</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Annual Compensation</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(total).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual Commission</p>
                <p className="text-2xl font-bold text-green-600">${Math.round(commission).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Total</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(monthlyTotal).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Base Salary</p>
                <p className="text-2xl font-bold text-gray-700">${Math.round(b).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
