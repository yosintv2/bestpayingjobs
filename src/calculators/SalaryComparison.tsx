"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function SalaryComparison() {
  const [salary1, setSalary1] = useState("90000");
  const [bonus1, setBonus1] = useState("10000");
  const [benefits1, setBenefits1] = useState("15000");
  const [salary2, setSalary2] = useState("80000");
  const [bonus2, setBonus2] = useState("5000");
  const [benefits2, setBenefits2] = useState("20000");
  const s1 = Math.max(0, parseFloat(salary1) || 0);
  const b1 = Math.max(0, parseFloat(bonus1) || 0);
  const e1 = Math.max(0, parseFloat(benefits1) || 0);
  const s2 = Math.max(0, parseFloat(salary2) || 0);
  const b2 = Math.max(0, parseFloat(bonus2) || 0);
  const e2 = Math.max(0, parseFloat(benefits2) || 0);
  const total1 = s1 + b1 + e1;
  const total2 = s2 + b2 + e2;
  const diff = total1 - total2;
  const monthly1 = total1 / 12;
  const monthly2 = total2 / 12;
  return (
    <CalculatorShell title="Salary Comparison Calculator" subtitle="Compare Two Job Offers Side by Side" description="Compare two job offers factoring in base salary, bonus, and benefits value. See which offer truly pays more." faqs={calculatorFaqs["salary-comparison"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Job Offer A</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Base Salary ($)</label>
                <input type="number" value={salary1} onChange={e => setSalary1(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Annual Bonus ($)</label>
                <input type="number" value={bonus1} onChange={e => setBonus1(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Benefits Value ($)</label>
                <input type="number" value={benefits1} onChange={e => setBenefits1(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Job Offer B</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Base Salary ($)</label>
                <input type="number" value={salary2} onChange={e => setSalary2(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Annual Bonus ($)</label>
                <input type="number" value={bonus2} onChange={e => setBonus2(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Benefits Value ($)</label>
                <input type="number" value={benefits2} onChange={e => setBenefits2(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Comparison Results</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Offer A Total</p>
              <p className="text-2xl font-bold text-emerald-600">${Math.round(total1).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">${Math.round(monthly1).toLocaleString()}/mo</p>
            </div>
            <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Offer B Total</p>
              <p className="text-2xl font-bold text-emerald-600">${Math.round(total2).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">${Math.round(monthly2).toLocaleString()}/mo</p>
            </div>
            <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Difference</p>
              <p className={`text-2xl font-bold ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-gray-700"}`}>
                {diff > 0 ? "Offer A +" : diff < 0 ? "Offer B +" : "Equal"}
                {diff !== 0 ? `$${Math.round(Math.abs(diff)).toLocaleString()}` : ""}
              </p>
              <p className="text-xs text-gray-400 mt-1">{diff !== 0 ? `$${Math.round(Math.abs(diff) / 12).toLocaleString()}/mo` : ""}</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
