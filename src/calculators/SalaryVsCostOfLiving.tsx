"use client";
import { useState } from "react";
import CalculatorShell, { calculatorFaqs } from "@/components/CalculatorShell";

const cities: Record<string, { name: string; col: number }> = {
  "new-york": { name: "New York City", col: 100 },
  "san-francisco": { name: "San Francisco", col: 98 },
  "los-angeles": { name: "Los Angeles", col: 85 },
  "chicago": { name: "Chicago", col: 78 },
  "austin": { name: "Austin, TX", col: 72 },
  "denver": { name: "Denver, CO", col: 76 },
  "miami": { name: "Miami, FL", col: 88 },
  "seattle": { name: "Seattle, WA", col: 90 },
  "boston": { name: "Boston, MA", col: 92 },
  "phoenix": { name: "Phoenix, AZ", col: 68 },
  "portland": { name: "Portland, OR", col: 79 },
  "atlanta": { name: "Atlanta, GA", col: 71 },
  "dallas": { name: "Dallas, TX", col: 70 },
  "houston": { name: "Houston, TX", col: 66 },
  "washington-dc": { name: "Washington DC", col: 95 },
  "london": { name: "London, UK", col: 88 },
  "tokyo": { name: "Tokyo, Japan", col: 85 },
  "sydney": { name: "Sydney, Australia", col: 82 },
  "berlin": { name: "Berlin, Germany", col: 65 },
  "paris": { name: "Paris, France", col: 80 },
  "singapore": { name: "Singapore", col: 90 },
  "dubai": { name: "Dubai, UAE", col: 82 },
  "toronto": { name: "Toronto, Canada", col: 81 },
};

export default function SalaryVsCostOfLiving() {
  const [currentSalary, setCurrentSalary] = useState("80000");
  const [currentCity, setCurrentCity] = useState("austin");
  const [targetCity, setTargetCity] = useState("san-francisco");
  const cs = Math.max(0, parseFloat(currentSalary) || 0);
  const cc = cities[currentCity]?.col || 72;
  const tc = cities[targetCity]?.col || 100;
  const equivalent = tc > 0 ? cs * (tc / cc) : 0;
  const diff = equivalent - cs;
  return (
    <CalculatorShell title="Salary vs Cost of Living Calculator" subtitle="Compare Salaries Across Different Cities" description="See how far your salary goes in different cities. Enter your salary and current location to find the equivalent salary needed elsewhere." faqs={calculatorFaqs["salary-vs-cost-of-living"]}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary ($)</label>
            <input type="number" value={currentSalary} onChange={e => setCurrentSalary(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
            <select value={currentCity} onChange={e => setCurrentCity(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {Object.entries(cities).map(([k, v]) => <option key={k} value={k}>{v.name} (COL: {v.col})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target City</label>
            <select value={targetCity} onChange={e => setTargetCity(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {Object.entries(cities).map(([k, v]) => <option key={k} value={k}>{v.name} (COL: {v.col})</option>)}
            </select>
          </div>
        </div>
        {cs > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cost of Living Comparison</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Equivalent Salary in {cities[targetCity]?.name}</p>
                <p className="text-2xl font-bold text-emerald-600">${Math.round(equivalent).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Current Salary</p>
                <p className="text-2xl font-bold text-gray-700">${Math.round(cs).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Difference</p>
                <p className={`text-2xl font-bold ${diff >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {diff >= 0 ? "+" : ""}${Math.round(diff).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">COL Index Change</p>
                <p className="text-2xl font-bold text-emerald-600">{cc > 0 ? ((tc - cc) / cc * 100).toFixed(1) : "0"}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
