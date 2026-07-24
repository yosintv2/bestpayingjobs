import countriesData from "@/data/countries.json";
import categoriesData from "@/data/categories.json";
import allJobsData from "@/data/all-jobs.json";
import siteConfig from "@/data/site-config.json";

const config = siteConfig as { site: { year: number } };

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
  slug: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Job {
  rank: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
  reasons: string[];
}

export interface Top10Job {
  rank: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  reasons: string[];
}

export interface CountryJobs {
  country: string;
  currency: string;
  top10: Top10Job[];
  jobs: Record<string, Job[]>;
}

const allJobs = allJobsData as Record<string, CountryJobs>;

export function getCountries(): Country[] {
  return countriesData as Country[];
}

export function getCountryByCode(code: string): Country | undefined {
  if (!code) return undefined;
  return getCountries().find((c) => c.code === code.toLowerCase());
}

export function getCountryBySlug(slug: string): Country | undefined {
  if (!slug) return undefined;
  return getCountries().find((c) => c.slug === slug.toLowerCase());
}

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getCurrentYear(): number {
  return config.site.year;
}

export function getSiteConfig() {
  return siteConfig;
}

export function getCountryJobs(code: string): CountryJobs | undefined {
  return allJobs[code.toLowerCase()];
}

export function hasCountryJobs(code: string): boolean {
  return code.toLowerCase() in allJobs;
}
