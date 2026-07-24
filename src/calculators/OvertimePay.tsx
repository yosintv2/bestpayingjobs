"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

export default function OvertimePay() {
  const [hourly, setHourly] = useState("25");
  const [regularHours, setRegularHours] = useState("40");
  const [otHours, setOtHours] = useState("10");
  const [otMultiplier, setOtMultiplier] = useState("1.5");
  const h = Math.max(0, parseFloat(hourly) || 0);
  const rh = Math.max(0, parseFloat(regularHours) || 0);
  const ot = Math.max(0, parseFloat(otHours) || 0);
  const m = Math.max(1, parseFloat(otMultiplier) || 1.5);
  const regularPay = h * rh;
  const otRate = h * m;
  const otPay = otRate * ot;
  const totalPay = regularPay + otPay;
  const weeklyAvg = totalPay / (rh + ot > 0 ? 1 : 1);
  return (
    <CalculatorShell title="Overtime Pay Calculator" subtitle="Calculate Your Overtime Earnings" description="Estimate your earnings when working beyond standard hours. Enter your hourly rate, overtime multiplier, and overtime hours." faqs={calculatorFaqs["overtime-pay"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
            <input type="number" value={hourly} onChange={e => setHourly(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regular Hours per Week</label>
            <input type="number" value={regularHours} onChange={e => setRegularHours(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Hours per Week</label>
            <input type="number" value={otHours} onChange={e => setOtHours(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Multiplier</label>
            <select value={otMultiplier} onChange={e => setOtMultiplier(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="1.5">1.5x (Time and a Half)</option>
              <option value="2">2.0x (Double Time)</option>
              <option value="1.75">1.75x</option>
            </select>
          </div>
        </div>
        {totalPay > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Overtime Earnings</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Weekly Pay</p>
                <p className="text-2xl font-bold text-emerald-600">${totalPay.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Regular Pay</p>
                <p className="text-2xl font-bold text-gray-700">${regularPay.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg border border-green-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Overtime Pay</p>
                <p className="text-2xl font-bold text-green-600">${otPay.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">OT Rate</p>
                <p className="text-2xl font-bold text-emerald-600">${otRate.toFixed(2)}/hr</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
