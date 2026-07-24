import citiesData from "@/data/cities.json";

export interface City {
  code: string;
  countrySlug: string;
  countryName: string;
  slug: string;
  name: string;
  type: "capital" | "major";
}

const cities = citiesData as City[];

export function getCities(): City[] {
  return cities;
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getCitiesByCountry(code: string): City[] {
  return cities.filter((c) => c.code === code);
}

export function cityMultiplier(type: "capital" | "major"): number {
  return type === "capital" ? 1.15 : 1.05;
}
