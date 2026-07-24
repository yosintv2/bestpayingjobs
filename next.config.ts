import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  async rewrites() {
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
