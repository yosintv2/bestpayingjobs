import { getCountries, getCountryJobs, getCategories } from "./db";
import { toUSD } from "./salary";

export interface CategorySalaryStats {
  avgMaxSalary: number;
  topCountry: string;
  countrySalaries: { code: string; name: string; flag: string; avgMax: number }[];
}

export function getCategorySalaries(): Record<string, CategorySalaryStats> {
  const countries = getCountries();
  const categories = getCategories();
  const result: Record<string, CategorySalaryStats> = {};

  for (const cat of categories) {
    const salaries: { code: string; name: string; flag: string; maxSalaries: number[] }[] = [];

    for (const country of countries) {
      const data = getCountryJobs(country.code);
      if (!data) continue;
      const jobs = data.jobs[cat.slug];
      if (!jobs || jobs.length === 0) continue;

      const maxSalaries = jobs.map((j) => toUSD(j.salaryMax, data.currency));
      salaries.push({
        code: country.code,
        name: country.name,
        flag: country.flag,
        maxSalaries,
      });
    }

    if (salaries.length === 0) {
      result[cat.slug] = { avgMaxSalary: 0, topCountry: "", countrySalaries: [] };
      continue;
    }

    const countryAverages = salaries.map((s) => ({
      code: s.code,
      name: s.name,
      flag: s.flag,
      avgMax: Math.round(s.maxSalaries.reduce((a, b) => a + b, 0) / s.maxSalaries.length),
    }));

    countryAverages.sort((a, b) => b.avgMax - a.avgMax);

    const allMax = salaries.flatMap((s) => s.maxSalaries);
    const avgMaxSalary = Math.round(allMax.reduce((a, b) => a + b, 0) / allMax.length);

    result[cat.slug] = {
      avgMaxSalary,
      topCountry: countryAverages[0]?.name ?? "",
      countrySalaries: countryAverages,
    };
  }

  return result;
}
