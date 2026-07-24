"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function SalaryToHourly() {
  const [salaryType, setSalaryType] = useState<"annual" | "monthly">("annual");
  const [salary, setSalary] = useState("60000");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const s = parseFloat(salary) || 0;
  const hpw = parseFloat(hoursPerWeek) || 40;
  const wpy = parseFloat(weeksPerYear) || 52;
  const annual = salaryType === "annual" ? s : s * 12;
  const hourly = hpw > 0 && wpy > 0 ? annual / (hpw * wpy) : 0;
  const daily = hourly * 8;
  const weekly = hourly * hpw;
  const monthly = annual / 12;
  return (
    <CalculatorShell title="Salary to Hourly Wage Calculator" subtitle="Convert Annual / Monthly Salary to Hourly Rate" description="Use our free Salary to Hourly Wage Calculator to instantly convert your annual or monthly salary into an hourly rate. Whether you're negotiating a contract, comparing job offers, or planning freelance work, knowing your true hourly wage helps you make informed career decisions." faqs={calculatorFaqs["salary-to-hourly"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
            <select value={salaryType} onChange={e => setSalaryType(e.target.value as any)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="annual">Annual Salary</option>
              <option value="monthly">Monthly Salary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{salaryType === "annual" ? "Annual" : "Monthly"} Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hours per Week</label>
            <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weeks per Year</label>
            <input type="number" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {hourly > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Hourly Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Hourly Rate", value: hourly },
                { label: "Daily Rate (8h)", value: daily },
                { label: "Weekly Rate", value: weekly },
                { label: "Monthly Equivalent", value: monthly },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${item.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
