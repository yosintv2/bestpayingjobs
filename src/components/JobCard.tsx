import type { Job } from "@/lib/db";

function formatSalary(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export default function JobCard({
  job,
  currency,
}: {
  job: Job;
  currency: string;
}) {
  return (
    <li className="flex items-center justify-between py-2.5 px-5 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0">
          {job.rank}
        </span>
        <span className="font-bold text-sm text-gray-900 truncate">{job.title}</span>
      </div>
      <span className="text-sm font-semibold text-emerald-600 shrink-0 ml-3 whitespace-nowrap">
        ({currency} {formatSalary(job.salaryMax)})
      </span>
    </li>
  );
}
