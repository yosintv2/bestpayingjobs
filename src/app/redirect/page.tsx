import type { Metadata } from "next";
import { getCountries, hasCountryJobs } from "@/lib/db";
import colIndex from "@/data/col-index.json";

const colData = colIndex as Record<string, number>;

export const metadata: Metadata = {
  title: "Redirect | BestPayingJobs.net",
  robots: { index: false, follow: true },
};

export default function RedirectPage() {
  const jobsCountries = getCountries().filter((c) => hasCountryJobs(c.code));
  const colCountries = jobsCountries.filter((c) => c.code in colData);

  const allCountries = jobsCountries.map((c) => c.slug);
  const colCountriesSlugs = colCountries.map((c) => c.slug);

  const script = `(function(){try{
    var p=new URLSearchParams(window.location.search);
    var s=p.get("src");

    var allSlugs=${JSON.stringify(allCountries)};
    var colSlugs=${JSON.stringify(colCountriesSlugs)};

    var routes=[
      {prefix:"average-salary/",slugs:allSlugs},
      {prefix:"best-paying-jobs-in/",slugs:allSlugs},
      {prefix:"cost-of-living/",slugs:colSlugs},
      {prefix:"take-home-pay/",slugs:colSlugs},
      {prefix:"part-time-jobs-in/",slugs:allSlugs},
      {prefix:"earn-money-online/",slugs:allSlugs}
    ];

    var route=routes[Math.floor(Math.random()*routes.length)];
    var slug=route.slugs[Math.floor(Math.random()*route.slugs.length)];
    var dest="/"+route.prefix+slug+"/"+(s?"?src="+s:"");
    window.location.replace(dest);
  }catch(e){}})();`;

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-white">
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p className="text-sm text-gray-400">Redirecting&hellip;</p>
    </main>
  );
}