"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function HouseAffordability() {
  const [salary, setSalary] = useState("100000");
  const [downPayment, setDownPayment] = useState("40000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [otherDebts, setOtherDebts] = useState("400");
  const [term, setTerm] = useState("30");
  const s = Math.max(0, parseFloat(salary) || 0);
  const dp = Math.max(0, parseFloat(downPayment) || 0);
  const ir = Math.max(0.1, parseFloat(interestRate) || 6.5) / 100 / 12;
  const od = Math.max(0, parseFloat(otherDebts) || 0);
  const t = parseInt(term) || 30;
  const n = t * 12;
  const monthlyGross = s / 12;
  const maxHousing = monthlyGross * 0.28;
  const maxDebtTotal = monthlyGross * 0.36;
  const maxPiti = Math.max(0, maxDebtTotal - od);
  const monthlyPayment = Math.min(maxHousing, maxPiti);
  const loanAmount = monthlyPayment * (Math.pow(1 + ir, n) - 1) / (ir * Math.pow(1 + ir, n));
  const homePrice = loanAmount + dp;
  return (
    <CalculatorShell title="How Much House Can I Afford Based on Salary?" subtitle="Home Affordability Calculator" description="Estimate how much house you can afford based on your income, down payment, and current interest rates using the 28/36 rule." faqs={calculatorFaqs["house-affordability"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Debt Payments ($)</label>
            <input type="number" value={otherDebts} onChange={e => setOtherDebts(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {homePrice > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Home Affordability</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Max Home Price</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(homePrice).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(loanAmount).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-emerald-600">$${Math.round(monthlyPayment).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Down Payment %</p>
                <p className="text-2xl font-bold text-emerald-600">{homePrice > 0 ? ((dp / homePrice) * 100).toFixed(1) : "0"}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
