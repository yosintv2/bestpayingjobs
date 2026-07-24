"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function JobOfferComparison() {
  const [job1, setJob1] = useState({ title: "Senior Engineer", salary: "120000", bonus: "15000", equity: "10000", commute: "3000" });
  const [job2, setJob2] = useState({ title: "Lead Developer", salary: "110000", bonus: "10000", equity: "25000", commute: "1200" });
  const update1 = (k: string, v: string) => setJob1(p => ({ ...p, [k]: v }));
  const update2 = (k: string, v: string) => setJob2(p => ({ ...p, [k]: v }));
  const fields = [
    { key: "title", label: "Job Title", type: "text" },
    { key: "salary", label: "Base Salary ($)", type: "number" },
    { key: "bonus", label: "Annual Bonus ($)", type: "number" },
    { key: "equity", label: "Equity/Year ($)", type: "number" },
    { key: "commute", label: "Annual Commute Cost ($)", type: "number" },
  ] as const;
  const calcTotal = (j: typeof job1) => {
    const s = Math.max(0, parseFloat(j.salary) || 0);
    const b = Math.max(0, parseFloat(j.bonus) || 0);
    const e = Math.max(0, parseFloat(j.equity) || 0);
    const c = Math.max(0, parseFloat(j.commute) || 0);
    return s + b + e - c;
  };
  const t1 = calcTotal(job1);
  const t2 = calcTotal(job2);
  const diff = t1 - t2;
  const better = diff > 0 ? 1 : diff < 0 ? 2 : 0;
  const monthlyDiff = Math.abs(diff) / 12;
  return (
    <CalculatorShell title="Job Offer Comparison Calculator" subtitle="Compare Total Compensation Packages" description="Evaluate multiple job offers by comparing total compensation including base salary, bonuses, equity, benefits, and commute costs." faqs={calculatorFaqs["job-offer-comparison"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <div className={`border-2 rounded-xl p-5 ${better === 1 ? "border-emerald-400 bg-emerald-50/30" : "border-gray-200"}`}>
            <h3 className="font-bold text-gray-900 mb-3">Offer A {better === 1 && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full ml-2">Better</span>}</h3>
            <div className="space-y-3">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} value={(job1 as any)[f.key]} onChange={e => update1(f.key, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Total Compensation: <span className="text-xl font-bold text-emerald-600">${Math.round(t1).toLocaleString()}</span></p>
            </div>
          </div>
          <div className={`border-2 rounded-xl p-5 ${better === 2 ? "border-emerald-400 bg-emerald-50/30" : "border-gray-200"}`}>
            <h3 className="font-bold text-gray-900 mb-3">Offer B {better === 2 && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full ml-2">Better</span>}</h3>
            <div className="space-y-3">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} value={(job2 as any)[f.key]} onChange={e => update2(f.key, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Total Compensation: <span className="text-xl font-bold text-emerald-600">${Math.round(t2).toLocaleString()}</span></p>
            </div>
          </div>
        </div>
        {diff !== 0 && (
          <div className={`rounded-xl p-4 text-center text-sm font-semibold ${better === 1 ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
            Offer {better === 1 ? "A" : "B"} is better by ${Math.round(Math.abs(diff)).toLocaleString()} per year (${Math.round(monthlyDiff).toLocaleString()}/month)
          </div>
        )}
        {diff === 0 && t1 > 0 && (
          <div className="rounded-xl p-4 text-center text-sm font-semibold bg-gray-50 text-gray-600 border border-gray-200">
            Both offers are equal in total compensation
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
