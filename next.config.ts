import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? { output: "export" } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
  async rewrites() {
    if (process.env.GITHUB_PAGES === "true") return [];
    return [
      {
        source: "/best-paying-jobs-in-:slug",
        destination: "/best-paying-jobs-in/:slug",
      },
      {
        source: "/category/:slug",
        destination: "/jobs/:slug",
      },
      {
        source: "/salary-in-:slug",
        destination: "/salary-in/:slug",
      },
      {
        source: "/part-time-jobs-in-:slug",
        destination: "/part-time-jobs-in/:slug",
      },
    ];
  },
};

export default nextConfig;
