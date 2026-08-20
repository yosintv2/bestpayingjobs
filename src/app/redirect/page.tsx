import type { Metadata } from "next";
import { getCountries, hasCountryJobs } from "@/lib/db";

export const metadata: Metadata = {
  title: "Redirect | BestPayingJobs.net",
  robots: { index: false, follow: true },
};

export default function RedirectPage() {
  const slugs = getCountries().filter((c) => hasCountryJobs(c.code)).map((c) => c.slug);
  const script = `(function(){try{
    var p=new URLSearchParams(window.location.search);
    var s=p.get("src");
    var slugs=${JSON.stringify(slugs)};
    var slug=slugs[Math.floor(Math.random()*slugs.length)];
    var routes=["average-salary-","best-paying-jobs-in-","cost-of-living-"];
    var prefix=routes[Math.floor(Math.random()*routes.length)];
    var dest="/"+prefix+slug+"/"+(s?"?src="+s:"");
    window.location.replace(dest);
  }catch(e){}})();`;

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-white">
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p className="text-sm text-gray-400">Redirecting&hellip;</p>
    </main>
  );
}