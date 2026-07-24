"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function FreelanceHourlyRate() {
  const [targetSalary, setTargetSalary] = useState("100000");
  const [billableHours, setBillableHours] = useState("1200");
  const [taxRate, setTaxRate] = useState("30");
  const [expenses, setExpenses] = useState("10000");
  const [ptoWeeks, setPtoWeeks] = useState("4");
  const ts = Math.max(0, parseFloat(targetSalary) || 0);
  const bh = Math.max(100, parseFloat(billableHours) || 1200);
  const tr = Math.max(0, parseFloat(taxRate) || 30) / 100;
  const ex = Math.max(0, parseFloat(expenses) || 0);
  const pto = Math.max(0, parseFloat(ptoWeeks) || 4);
  const totalNeeded = ts + ex;
  const preTax = totalNeeded / (1 - tr);
  const hourlyRate = preTax / bh;
  const annualHours = (52 - pto) * 40;
  const utilization = bh / annualHours * 100;
  return (
    <CalculatorShell title="Freelance Hourly Rate Calculator" subtitle="Convert Your Salary to a Freelance Rate" description="Determine what hourly rate to charge as a freelancer based on your desired salary, billable hours, expenses, and taxes." faqs={calculatorFaqs["freelance-hourly-rate"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desired Annual Salary ($)</label>
            <input type="number" value={targetSalary} onChange={e => setTargetSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billable Hours per Year</label>
            <input type="number" value={billableHours} onChange={e => setBillableHours(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Self-Employment Tax Rate (%)</label>
            <select value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="25">25% (Low income)</option>
              <option value="30">30% (Moderate income)</option>
              <option value="35">35% (Higher income)</option>
              <option value="40">40% (High income)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Business Expenses ($)</label>
            <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unpaid Time Off (weeks)</label>
            <input type="number" value={ptoWeeks} onChange={e => setPtoWeeks(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {hourlyRate > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Freelance Rate</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Minimum Hourly Rate</p>
                <p className="text-2xl font-bold text-emerald-600">${hourlyRate.toFixed(2)}/hr</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Revenue Needed (Pre-Tax)</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(preTax).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Taxes & Expenses</p>
                <p className="text-2xl font-bold text-amber-600">${Math.round(preTax - ts).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Billable Utilization</p>
                <p className="text-2xl font-bold text-emerald-600">{utilization.toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Based on {(52 - pto).toFixed(0)} working weeks &middot; {billableHours} billable hours &middot; {taxRate}% tax rate</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
