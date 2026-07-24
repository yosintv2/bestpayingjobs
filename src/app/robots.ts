import { MetadataRoute } from "next";

const aiCrawlers = [
  "GPTBot",
  "Google-Extended",
  "CCBot",
  "Claude-Web",
  "PerplexityBot",
  "Applebot-Extended",
  "Bytespider",
  "FacebookBot",
  "Amazonbot",
  "anthropic-ai",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "OmgiliBot",
  "PetalBot",
  "Scrapy",
  "SemrushBot",
  "SiteAuditBot",
  "AhrefsBot",
  "DotBot",
  "Meltwater",
  "omgili",
  "Screaming Frog SEO Spider",
  "MJ12bot",
  "BLEXBot",
  "DataForSeoBot",
  "MozDotBot",
  "SeekrBot",
  "Timpibot",
  "VelenPublicWebCrawler",
  "Webzio-Extended",
  "YouBot",
  "Kangaroo Bot",
  "ai-glimpse",
  "IAScanner",
  "IMPCrawler",
  "SentiBot",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...aiCrawlers.map((ua) => ({
        userAgent: ua,
        allow: "/",
      })),
    ],
    sitemap: "https://www.bestpayingjobs.net/sitemap.xml",
  };
}
