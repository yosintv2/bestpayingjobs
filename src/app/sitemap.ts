import { MetadataRoute } from "next";
import { getCountries, getCategories } from "@/lib/db";
import { getCities } from "@/lib/city";
import calculators from "@/data/calculators.json";
import blogPosts from "@/data/blog-posts.json";
import salaryLetters from "@/data/salary-letters.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://www.bestpayingjobs.net";
  const countries = getCountries();
  const categories = getCategories();
  const cities = getCities();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/global-ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/salary-increase-letter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/jobs/ai-machine-learning`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${siteUrl}/best-paying-jobs-in-${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${siteUrl}/salary-in-${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/jobs/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const calculatorPages: MetadataRoute.Sitemap = calculators.map((calc) => ({
    url: `${siteUrl}/calculator/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = (blogPosts as any[]).map((post) => ({
    url: `${siteUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const letterPages: MetadataRoute.Sitemap = (salaryLetters as { id: string }[]).map((letter) => ({
    url: `${siteUrl}/salary-increase-letter/${letter.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...countryPages,
    ...cityPages,
    ...categoryPages,
    ...calculatorPages,
    ...blogPages,
    ...letterPages,
  ];
}
