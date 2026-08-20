import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { CURRENT_YEAR } from "@/lib/db";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-num",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const siteUrl = "https://www.bestpayingjobs.net";

const layoutTitleDefault = `Best Paying Jobs in Every Country ${CURRENT_YEAR} | BestPayingJobs.net`;
const layoutTitleShort = `Best Paying Jobs in Every Country ${CURRENT_YEAR}`;
const layoutDesc = `Discover the highest paying jobs in every country. Compare salaries across 30+ career categories including AI, Finance, IT, Healthcare, Engineering and more. Updated for ${CURRENT_YEAR}.`;
const layoutDescShort = `Discover the highest paying jobs in every country. Compare salaries across 30+ career categories. Updated for ${CURRENT_YEAR}.`;

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/favicon.svg" },
    ],
  },
  title: {
    default: layoutTitleDefault,
    template: "%s | BestPayingJobs.net",
  },
  description: layoutDesc,
  keywords: [
    "best paying jobs",
    "highest salary jobs",
    "top paying careers",
    "salary comparison",
    "jobs by country",
    "high salary careers",
    `best paying jobs ${CURRENT_YEAR}`,
    "AI jobs salary",
    "highest paying professions",
    "salary by country",
    "global salary comparison",
    "career salary guide",
    "job salary data",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: layoutTitleShort,
    description: layoutDescShort,
    url: siteUrl,
    siteName: "BestPayingJobs.net",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 750,
        alt: "Best Paying Jobs in Every Country",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: layoutTitleShort,
    description: layoutDescShort,
    images: ["/og/default.webp"],
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
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BestPayingJobs.net",
    url: siteUrl,
    description: "Best Paying Jobs in Every Country",
  };

  // Applies the saved/system theme before first paint so the page never
  // flashes light before switching to dark.
  const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#12201c" media="(prefers-color-scheme: dark)" />
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
      <body className="min-h-full flex flex-col">
        {children}
        <div style={{ position: "fixed", top: 0, left: 0, width: "1px", height: "1px", overflow: "hidden", visibility: "hidden" }}>
          <script id="_waut41">var _wau = _wau || []; _wau.push(["dynamic", "v4vzytwpx3", "t41", "c4302bffffff", "small"]);</script>
          <script async src="//waust.at/d.js" />
        </div>
      </body>
    </html>
  );
}
