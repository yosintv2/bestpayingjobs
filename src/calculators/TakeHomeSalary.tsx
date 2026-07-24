"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function TakeHomeSalary() {
  const [salary, setSalary] = useState("75000");
  const [state, setState] = useState("California");
  const [preTaxDeductions, setPreTaxDeductions] = useState("5000");
  const [filing, setFiling] = useState("single");
  const s = Math.max(0, parseFloat(salary) || 0);
  const pt = Math.max(0, parseFloat(preTaxDeductions) || 0);
  const taxable = Math.max(0, s - pt);
  const brackets2025: [number, number][] = filing === "single"
    ? [[0, 0.1], [11925, 0.12], [48475, 0.22], [103350, 0.24], [197300, 0.32], [250525, 0.35], [626350, 0.37]]
    : [[0, 0.1], [23850, 0.12], [96950, 0.22], [206700, 0.24], [394600, 0.32], [501050, 0.35], [751600, 0.37]];
  let federalTax = 0;
  let prevBracket = 0;
  for (const [bracket, rate] of brackets2025) {
    if (taxable > bracket) {
      federalTax += Math.min(taxable - prevBracket, bracket - prevBracket) * (prevBracket > 0 ? brackets2025[brackets2025.findIndex(b => b[0] === prevBracket)][1] : 0);
      prevBracket = bracket;
    }
  }
  if (taxable > prevBracket) {
    federalTax += (taxable - prevBracket) * brackets2025[brackets2025.length - 1][1];
  }
  const stateRates: Record<string, number> = { "California": 0.093, "New York": 0.0685, "Texas": 0, "Florida": 0, "Washington": 0, "Illinois": 0.0495 };
  const stateTax = taxable * (stateRates[state] || 0.05);
  const socialSecurity = Math.min(taxable, 168600) * 0.062;
  const medicare = taxable * 0.0145;
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + pt;
  const netPay = Math.max(0, s - totalDeductions);
  const monthlyNet = netPay / 12;
  return (
    <CalculatorShell title="Take-Home Salary Calculator" subtitle="Calculate Your Net Pay After Deductions" description="Our Take-Home Salary Calculator estimates your net pay after common deductions including federal and state taxes, Social Security, Medicare, and retirement contributions." faqs={calculatorFaqs["take-home-salary"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select value={state} onChange={e => setState(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {Object.keys(stateRates).concat("Other").map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Tax Deductions ($)</label>
            <input type="number" value={preTaxDeductions} onChange={e => setPreTaxDeductions(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
            <select value={filing} onChange={e => setFiling(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
        </div>
        {netPay > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Take-Home Pay Summary</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Annual Net Pay</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(netPay).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Net Pay</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(monthlyNet).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-red-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-500">${Math.round(totalDeductions - pt).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-amber-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Effective Tax Rate</p>
                <p className="text-2xl font-bold text-amber-600">{s > 0 ? ((totalDeductions / s) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Federal Income Tax: <span className="font-semibold text-gray-900">${Math.round(federalTax).toLocaleString()}</span></p>
              <p>State Tax ({state}): <span className="font-semibold text-gray-900">${Math.round(stateTax).toLocaleString()}</span></p>
              <p>Social Security: <span className="font-semibold text-gray-900">${Math.round(socialSecurity).toLocaleString()}</span></p>
              <p>Medicare: <span className="font-semibold text-gray-900">${Math.round(medicare).toLocaleString()}</span></p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
