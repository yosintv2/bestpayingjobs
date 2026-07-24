import data from "@/data/part-time-jobs.json";
import fxRatesData from "@/data/fx-rates.json";
import colData from "@/data/col-index.json";

const fxRates = fxRatesData as Record<string, number>;
const colIndex = colData as Record<string, number>;

export interface PartTimeJob {
  rank: number;
  title: string;
  description: string;
  hourlyRate: number;
  monthlySalary: number;
  weeklyHours: number;
}

interface PartTimeConfig {
  baseUsdHourly: number;
  usColIndex: number;
  weeklyHours: number;
  maxJobs: number;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  sectionTitle: string;
  sectionSubtitle: string;
  breadcrumbLabel: string;
}

interface PartTimeJobDef {
  rank: number;
  title: string;
  description: string;
  multiplier: number;
}

interface PartTimeData {
  config: PartTimeConfig;
  jobs: PartTimeJobDef[];
}

const ptData = data as unknown as PartTimeData;
const cfg = ptData.config;
const WEEKS_PER_MONTH = 4;

export function getConfig() {
  return cfg;
}

export function getPartTimeJobs(
  countryCode: string,
  currency: string
): PartTimeJob[] {
  const col = colIndex[countryCode.toLowerCase()];
  if (!col) return [];

  const fxRate = fxRates[currency];
  if (!fxRate) return [];

  const colFactor = col / cfg.usColIndex;
  const baseLocal = Math.round(cfg.baseUsdHourly * colFactor * fxRate);

  return ptData.jobs.map((job) => {
    const hourlyRate = Math.round(baseLocal * job.multiplier);
    const monthlySalary = hourlyRate * cfg.weeklyHours * WEEKS_PER_MONTH;

    return {
      rank: job.rank,
      title: job.title,
      description: job.description,
      hourlyRate,
      monthlySalary,
      weeklyHours: cfg.weeklyHours,
    };
  });
}
