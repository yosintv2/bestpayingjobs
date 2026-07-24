interface ChartData {
  country: string;
  salary: number;
  flag: string;
}

export default function StaticSalaryChart({
  data,
  category,
}: {
  data: ChartData[];
  category: string;
}) {
  const maxSalary = Math.max(...data.map((d) => d.salary));
  const barHeight = 28;
  const gap = 12;
  const chartWidth = 600;
  const labelWidth = 130;
  const barMaxWidth = chartWidth - labelWidth - 60;

  return (
    <svg
      width="100%"
      height={data.length * (barHeight + gap) + 20}
      viewBox={`0 0 ${chartWidth} ${data.length * (barHeight + gap) + 20}`}
      role="img"
      aria-label={`Average salaries for ${category} by country`}
      className="w-full"
    >
      <text x="0" y="16" fontSize="14" fontWeight="bold" fill="#111827">
        Average Salary by Country
      </text>
      {data.map((d, i) => {
        const y = 32 + i * (barHeight + gap);
        const barW = maxSalary > 0 ? (d.salary / maxSalary) * barMaxWidth : 0;
        return (
          <g key={d.country}>
            <text
              x="0"
              y={y + barHeight / 2 + 4}
              fontSize="11"
              fill="#374151"
              fontWeight="500"
              textAnchor="start"
            >
              {d.flag} {d.country}
            </text>
            <rect
              x={labelWidth}
              y={y}
              width={Math.max(barW, 4)}
              height={barHeight}
              fill="#059669"
              rx="4"
            />
            <text
              x={labelWidth + barW + 6}
              y={y + barHeight / 2 + 4}
              fontSize="11"
              fill="#059669"
              fontWeight="600"
            >
              ${(d.salary / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}
