import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.bestpayingjobs.net";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: {
    default: "Best Paying Jobs in Every Country 2026 | BestPayingJobs.net",
    template: "%s | BestPayingJobs.net",
  },
  description:
    "Discover the highest paying jobs in every country. Compare salaries across 30+ career categories including AI, Finance, IT, Healthcare, Engineering and more. Updated for 2026.",
  keywords: [
    "best paying jobs",
    "highest salary jobs",
    "top paying careers",
    "salary comparison",
    "jobs by country",
    "high salary careers",
    "best paying jobs 2026",
    "AI jobs salary",
    "highest paying professions",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Paying Jobs in Every Country (2026)",
    description:
      "Discover the highest paying jobs in every country. Compare salaries across 30+ career categories. Updated for 2026.",
    url: siteUrl,
    siteName: "BestPayingJobs.net",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Paying Jobs in Every Country (2026)",
    description:
      "Discover the highest paying jobs in every country. Compare salaries across 30+ career categories. Updated for 2026.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BestPayingJobs.net",
    url: siteUrl,
    description:
      "Discover the highest paying jobs in every country. Compare salaries across 30+ career categories.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/best-paying-jobs-in-{country_slug}`,
      },
      "query-input": "required name=country_slug",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BestPayingJobs.net",
    url: siteUrl,
    description: "Best Paying Jobs in Every Country",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
