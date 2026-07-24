"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  country: string;
  salary: number;
  flag: string;
}

export default function CategorySalaryChart({ data }: { data: ChartData[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: `${d.flag} ${d.country}`,
    salaryK: Math.round(d.salary / 1000),
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(v) => `${v}k`}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
            width={140}
          />
          <Tooltip
            formatter={(value) => [`$${value}k/yr`, "Avg. Salary"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="salaryK" fill="#059669" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
