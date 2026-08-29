import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountries, getCurrentYear } from "@/lib/db";
import { getAverageSalaryData, getAllCountrySlugs } from "@/lib/average-salary-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { BarChart, DistributionChart, GenderChart } from "@/components/SalaryChart";
import TrackingRedirect from "@/components/TrackingRedirect";
import { averageSalaryKeywords } from "@/lib/keywords";
const siteUrl = "https://www.bestpayingjobs.net";

export async function generateStaticParams() {
  return getAllCountrySlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getAverageSalaryData(slug);
  if (!data) return {};
  const { country, data: d } = data;
  const f = (n: number) => new Intl.NumberFormat("en-US").format(n);
  return {
    title: `Average Salary in ${country.name} ${d.year} | BestPayingJobs.net`,
    description: `The average salary in ${country.name} is ${f(d.averageSalary.annual)} ${country.currency} per year (${f(d.averageSalary.monthly)} ${country.currency} per month). Salary range: ${f(d.salaryDistribution.minimum)} - ${f(d.salaryDistribution.maximum)} ${country.currency}.`,
    keywords: averageSalaryKeywords({
      country: country.name,
      year: d.year,
      currency: country.currency,
    }),
    alternates: { canonical: `${siteUrl}/average-salary/${country.slug}` },
    openGraph: {
      title: `Average Salary in ${country.name} ${d.year} | BestPayingJobs.net`,
      description: `The average salary in ${country.name} is ${f(d.averageSalary.annual)} ${country.currency} per year.`,
      images: [{ url: "/og/default.webp", width: 1200, height: 750, alt: `Average Salary in ${country.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Average Salary in ${country.name} ${d.year} | BestPayingJobs.net`,
      description: `The average salary in ${country.name} is ${f(d.averageSalary.annual)} ${country.currency} per year.`,
      images: ["/og/default.webp"],
    },
  };
}

function f(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function pct(from: number, to: number): string {
  if (from === 0) return "0%";
  return `+${Math.round(((to - from) / from) * 100)}%`;
}

export default async function AverageSalaryPage({ params }: Props) {
  const { slug } = await params;
  const data = getAverageSalaryData(slug);
  if (!data) notFound();

  const { country, data: d } = data;
  const year = getCurrentYear();
  const countries = getCountries();
  const C = country.currency;
  const pageUrl = `${siteUrl}/average-salary/${country.slug}`;

  const expLevels = [
    { label: "0–2 Years", value: d.experience["0-2"], desc: "Entry Level" },
    { label: "2–5 Years", value: d.experience["2-5"], desc: "Junior" },
    { label: "5–10 Years", value: d.experience["5-10"], desc: "Mid-Career" },
    { label: "10–15 Years", value: d.experience["10-15"], desc: "Experienced" },
    { label: "15+ Years", value: d.experience["15-plus"], desc: "Senior" },
  ];

  const eduSteps = [
    { from: "High School", to: "Certificate", pct: pct(d.education.highSchool, d.education.certificate) },
    { from: "Certificate", to: "Bachelor's", pct: pct(d.education.certificate, d.education.bachelors) },
    { from: "Bachelor's", to: "Master's", pct: pct(d.education.bachelors, d.education.masters) },
    { from: "Master's", to: "PhD", pct: pct(d.education.masters, d.education.phd) },
  ];

  const topIndustries = [...d.industries].sort((a, b) => b.averageSalary - a.averageSalary).slice(0, 5);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Average Salary by Country", item: `${siteUrl}/average-salary` },
      { "@type": "ListItem", position: 3, name: `Average Salary in ${country.name}`, item: pageUrl },
    ],
  };

  const shareTitle = `Average Salary in ${country.name} ${year}`;

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <TrackingRedirect />
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-1">
          Average Salary in {country.name} {year}
        </h1>
        <p className="text-gray-500 text-sm mb-4">Currency: {C} &middot; Updated for {d.year}</p>
        <ShareButtons title={shareTitle} />

        {/* ==================== HERO SALARY CARD ==================== */}
        <section className="mt-6 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-6 sm:p-8 text-white">
            <p className="text-sm text-emerald-100 mb-1 font-medium">How much money does a person working in {country.name} make?</p>
            <p className="text-xs text-emerald-200 mb-4">Average Monthly Salary</p>

            <div className="text-center">
              <p className="text-5xl sm:text-6xl font-bold tracking-tight">
                {f(d.averageSalary.monthly)} {C}
              </p>
              <p className="text-emerald-200 text-sm mt-1">
                ( {f(d.averageSalary.annual)} {C} yearly )
              </p>
              <p className="text-emerald-300 text-xs mt-1">
                ~ {f(d.averageSalary.usd.monthly)} USD per month ( {f(d.averageSalary.usd.annual)} USD yearly )
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "LOW", value: `${f(d.salaryDistribution.minimum)} ${C}`, usd: `${f(d.averageSalary.usd.minimum)} USD` },
                { label: "AVERAGE", value: `${f(d.averageSalary.monthly)} ${C}`, usd: `${f(d.averageSalary.usd.monthly)} USD`, bold: true },
                { label: "HIGH", value: `${f(d.salaryDistribution.maximum)} ${C}`, usd: `${f(d.averageSalary.usd.maximum)} USD` },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl ${item.bold ? "bg-white/20" : "bg-white/10"} px-3 py-3`}>
                  <p className="text-[10px] sm:text-xs text-emerald-200 font-medium">{item.label}</p>
                  <p className={`${item.bold ? "text-lg sm:text-xl" : "text-sm sm:text-base"} font-bold`}>{item.value}</p>
                  <p className="text-[10px] text-emerald-300">{item.usd}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-gray-600 leading-relaxed">
            <p>
              A person working in {country.name} typically earns around{" "}
              <strong>{f(d.averageSalary.monthly)} {C}</strong> per month.{" "}
              Salaries range from <strong>{f(d.salaryDistribution.minimum)} {C}</strong> (lowest average) to{" "}
              <strong>{f(d.salaryDistribution.maximum)} {C}</strong> (highest average, actual maximum salary is higher).
            </p>
            <p className="mt-2">
              This is the average monthly salary including housing, transport, and other benefits.{" "}
              Salaries vary drastically between different careers. If you are interested in the salary of a particular job,{" "}
              see below for salaries for specific job titles.
            </p>
          </div>
        </section>

        {/* ==================== DISTRIBUTION ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Distribution of Salaries in {country.name}</h2>
          <p className="text-sm text-gray-500 mb-4">Median and salary distribution monthly {country.name}</p>

          <figure className="rounded-xl border border-gray-200 bg-white p-5">
            <DistributionChart
              items={[
                { label: "Minimum", value: d.salaryDistribution.minimum, valueLabel: `${f(d.salaryDistribution.minimum)} ${C}` },
                { label: "25th", value: d.salaryDistribution.p25, valueLabel: `${f(d.salaryDistribution.p25)} ${C}` },
                { label: "Median", value: d.salaryDistribution.median, valueLabel: `${f(d.salaryDistribution.median)} ${C}` },
                { label: "Average", value: d.salaryDistribution.average, valueLabel: `${f(d.salaryDistribution.average)} ${C}` },
                { label: "75th", value: d.salaryDistribution.p75, valueLabel: `${f(d.salaryDistribution.p75)} ${C}` },
                { label: "Maximum", value: d.salaryDistribution.maximum, valueLabel: `${f(d.salaryDistribution.maximum)} ${C}` },
              ]}
              maxValue={d.salaryDistribution.maximum}
            />
          </figure>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">
              What is the difference between the median and the average salary?
            </h3>
            <p className="text-sm text-gray-600">
              Both are indicators. If your salary is higher than both the average and the median then you are doing very well.{" "}
              If your salary is lower than both, then many people are earning more than you and there is plenty of room for improvement.{" "}
              If your wage is between the average and the median, then things can be a bit complicated.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              The median ({f(d.salaryDistribution.median)} {C}) represents the middle salary value — 50% earn more and 50% earn less.{" "}
              The average ({f(d.salaryDistribution.average)} {C}) is the sum of all salaries divided by the number of workers, and can be skewed by extremely high or low salaries.
            </p>
          </div>
        </section>

        {/* ==================== EXPERIENCE ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Salary Comparison by Years of Experience</h2>
          <p className="text-sm text-gray-500 mb-4">How does a person's salary progress over time?</p>

          <figure className="rounded-xl border border-gray-200 bg-white p-5">
            <BarChart
              items={expLevels.map((e) => ({
                label: `${e.label} (${e.desc})`,
                value: e.value,
                valueLabel: `${f(e.value)} ${C}`,
              }))}
            />
          </figure>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              The experience level is the most important factor in determining the salary. Naturally the more years of experience the higher the wage.
            </p>
            <p>
              Generally speaking, employees having experience from two to five years earn on average{" "}
              <strong>{pct(expLevels[0].value, expLevels[1].value)}</strong> more than freshers and juniors across all industries and disciplines.
            </p>
            <p>
              Professionals with experience of more than five years tend to earn on average{" "}
              <strong>{pct(expLevels[1].value, expLevels[2].value)}</strong> more than those with five years or less of work experience.
            </p>
            <p>
              As you hit the ten years mark, the salary increases by{" "}
              <strong>{pct(expLevels[2].value, expLevels[3].value)}</strong> and an additional{" "}
              <strong>{pct(expLevels[3].value, expLevels[4].value)}</strong> for those who have crossed the 15 years mark.
            </p>
            <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-sm font-medium text-emerald-800">
                &ldquo;On average, a person's salary doubles their starting salary by the time they cross the 10 years experience mark.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ==================== EDUCATION ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Salary Comparison By Education</h2>
          <p className="text-sm text-gray-500 mb-4">How does the education level affect your salary?</p>

          <figure className="rounded-xl border border-gray-200 bg-white p-5">
            <BarChart
              items={[
                { label: "High School", value: d.education.highSchool, valueLabel: `${f(d.education.highSchool)} ${C}` },
                { label: "Certificate", value: d.education.certificate, valueLabel: `${f(d.education.certificate)} ${C}` },
                { label: "Associate", value: d.education.associate, valueLabel: `${f(d.education.associate)} ${C}` },
                { label: "Bachelor's", value: d.education.bachelors, valueLabel: `${f(d.education.bachelors)} ${C}` },
                { label: "Master's", value: d.education.masters, valueLabel: `${f(d.education.masters)} ${C}` },
                { label: "PhD", value: d.education.phd, valueLabel: `${f(d.education.phd)} ${C}` },
              ]}
            />
          </figure>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {eduSteps.map((step) => (
              <div key={step.from} className="rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 p-4">
                <p className="text-xs text-gray-500">{step.from} → {step.to}</p>
                <p className="text-2xl font-bold text-emerald-700">{step.pct}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>
              It is well known that higher education equals a bigger salary, but how much more money can a degree add to your income?{" "}
              We compared the salaries of professionals at the same level but with different college degrees levels across many jobs, below are our findings.
            </p>
            <p>
              Workers with a certificate or diploma earn on average{" "}
              <strong>{pct(d.education.highSchool, d.education.certificate)}</strong> more than their peers who only reached the high school level.
            </p>
            <p>
              Employees who earned a Bachelor's Degree earn{" "}
              <strong>{pct(d.education.certificate, d.education.bachelors)}</strong> more than those who only managed to attain a certificate or diploma.
            </p>
            <p>
              Professionals who attained a Master's Degree are awarded salaries that are{" "}
              <strong>{pct(d.education.bachelors, d.education.masters)}</strong> more than those with a Bachelor's Degree.
            </p>
            <p>
              Finally, PhD holders earn <strong>{pct(d.education.masters, d.education.phd)}</strong> more than Master's Degree holders on average.
            </p>
          </div>
        </section>

        {/* ==================== GENDER ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Salary Comparison By Gender</h2>
          <p className="text-sm text-gray-500 mb-4">Salary comparison by gender monthly {country.name}</p>

          <figure className="rounded-xl border border-gray-200 bg-white p-5">
            <GenderChart
              maleValue={d.gender.male}
              femaleValue={d.gender.female}
              currency={C}
            />
            <p className="text-sm text-gray-600 mt-4 text-center">
              Though gender should not have an effect on pay, in reality, it does. So who gets paid more: men or women?{" "}
              Male employees in {country.name} earn <strong>{d.gender.gapPercentage}%</strong> more than their female counterparts on average across all sectors.
            </p>
          </figure>
        </section>

        {/* ==================== INCREMENT ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Average Annual Salary Increment Percentage in {country.name}
          </h2>
          <p className="text-sm text-gray-500 mb-4">How much are annual salary increments? How often do employees get salary raises?</p>

          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-700">{d.salaryGrowth.averageRaisePercentage}%</p>
              <p className="text-sm text-gray-500 mt-1">Average Raise</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-700">{d.salaryGrowth.averageReviewFrequencyMonths} months</p>
              <p className="text-sm text-gray-500 mt-1">Review Frequency</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 text-center">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-700">{d.salaryGrowth.annualizedRaisePercentage}%</p>
              <p className="text-sm text-gray-500 mt-1">Annualized Increase</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Employees in {country.name} are likely to observe a salary increase of approximately{" "}
              <strong>{d.salaryGrowth.averageRaisePercentage}%</strong> every{" "}
              <strong>{d.salaryGrowth.averageReviewFrequencyMonths} months</strong>.
            </p>
            <p>
              The annual salary Increase in a calendar year (12 months) can be easily calculated as follows:{" "}
              Annual Salary Increase = Increase Rate x 12 ÷ Increase Frequency
            </p>
            <p>
              The average salary increase in one year (12 months) in {country.name} is{" "}
              <strong>{d.salaryGrowth.annualizedRaisePercentage}%</strong>.
            </p>
          </div>
        </section>

        {/* ==================== BONUS ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Bonus and Incentive Rates in {country.name}</h2>
          <p className="text-sm text-gray-500 mb-4">How much and how often are bonuses being awarded?</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{d.bonuses.employeesReceivingBonusPercentage}%</p>
                  <p className="text-xs text-gray-500">Received Bonus</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-300">{100 - d.bonuses.employeesReceivingBonusPercentage}%</p>
                  <p className="text-xs text-gray-500">No Bonus</p>
                </div>
              </div>
              <div className="mt-3 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${d.bonuses.employeesReceivingBonusPercentage}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {d.bonuses.employeesReceivingBonusPercentage}% of surveyed staff in {country.name} reported receiving at least one form of monetary bonus.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-600 mb-2">Average Bonus Rate</p>
              <p className="text-3xl font-bold text-emerald-600">{d.bonuses.averageBonusPercentage}%</p>
              <p className="text-xs text-gray-500 mt-1">of annual salary</p>
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p><strong>Types of Bonuses Considered:</strong></p>
                <p>• Individual Performance-Based Bonuses</p>
                <p>• Company Performance Bonuses</p>
                <p>• Goal-Based Bonuses</p>
                <p>• Holiday / End of Year Bonuses</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Finance", "Sales", "Information Technology"].map((ind) => (
                  <span key={ind} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">{ind}: High</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TOP INDUSTRIES ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Top 5 Highest Paying Industries</h2>
          <p className="text-sm text-gray-500 mb-4">Annual average salaries</p>
          <figure className="rounded-xl border border-gray-200 bg-white p-5">
            <BarChart
              items={topIndustries.map((ind) => ({
                label: ind.name,
                value: ind.averageSalary,
                valueLabel: `${f(ind.averageSalary)} ${C}`,
              }))}
            />
          </figure>
        </section>

        {/* ==================== JOBS ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Salaries for Popular Jobs</h2>
          <p className="text-sm text-gray-500 mb-4">Sample job titles and their average salaries</p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">Job Title</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-right">Annual Salary</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-right">Monthly Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {d.jobs.sort((a, b) => b.averageSalary - a.averageSalary).map((job, i) => (
                  <tr key={job.slug} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-3 text-gray-700 font-medium">{job.title}</td>
                    <td className="px-5 py-3 text-right text-gray-900">{f(job.averageSalary)} {C}</td>
                    <td className="px-5 py-3 text-right text-gray-900">{f(job.monthlySalary)} {C}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-center">
            <Link
              href={`/best-paying-jobs-in/${country.slug}`}
              className="text-sm text-emerald-600 hover:underline font-medium"
            >
              View all jobs and categories in {country.name} →
            </Link>
          </div>
        </section>

        {/* ==================== CITIES ==================== */}
        {d.cities.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Salary Comparison By City</h2>
            <p className="text-sm text-gray-500 mb-4">Average annual salaries by city</p>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-3 font-semibold text-gray-600">City</th>
                    <th className="px-5 py-3 font-semibold text-gray-600 text-right">Average Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {d.cities.sort((a, b) => b.averageSalary - a.averageSalary).map((city, i) => (
                    <tr key={city.slug} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-5 py-3 text-gray-700 font-medium">{city.name}</td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">
                        {f(city.averageSalary)} {C}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ==================== SECTORS ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Government vs Private Sector Salary Comparison</h2>
          <p className="text-sm text-gray-500 mb-4">Where can you get paid more?</p>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-end gap-8 sm:gap-16 justify-center">
              {[
                { label: "Private Sector", value: d.sectors.private },
                { label: "Public Sector", value: d.sectors.public },
              ].map((s) => {
                const maxS = Math.max(d.sectors.private, d.sectors.public);
                const pctH = Math.round((s.value / maxS) * 100);
                const isHigher = s.value === maxS;
                const diff = isHigher
                  ? s.label === "Private Sector"
                    ? `+${Math.round((s.value / d.sectors.public - 1) * 100)}%`
                    : `+${Math.round((s.value / d.sectors.private - 1) * 100)}%`
                  : "";
                return (
                  <div key={s.label} className="flex flex-col items-center">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{f(s.value)} {C}</p>
                    <div className="w-20 sm:w-24 bg-gray-100 rounded-lg overflow-hidden mt-2" style={{ height: "100px" }}>
                      <div
                        className={`w-full rounded-lg transition-all ${isHigher ? "bg-emerald-500" : "bg-orange-300"}`}
                        style={{ height: `${pctH}%`, position: "relative" }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 mt-2">{s.label}</p>
                    {diff && <p className="text-xs font-bold text-emerald-600">{diff}</p>}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              {d.sectors.public > d.sectors.private
                ? `Public sector employees in ${country.name} earn ${Math.round((d.sectors.public / d.sectors.private - 1) * 100)}% more than their private sector counterparts on average across all sectors.`
                : `Private sector employees in ${country.name} earn ${Math.round((d.sectors.private / d.sectors.public - 1) * 100)}% more than their public sector counterparts on average across all sectors.`}
            </p>
          </div>
        </section>

        {/* ==================== HOURLY WAGE ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Average Hourly Wage in {country.name}</h2>
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 text-center">
            <p className="text-5xl font-bold text-emerald-700">{f(d.averageSalary.hourly)} {C}</p>
            <p className="text-sm text-gray-500 mt-1">per hour</p>
            <p className="text-xs text-gray-400 mt-3 max-w-lg mx-auto">
              The average hourly wage (pay per hour) in {country.name} is {f(d.averageSalary.hourly)} {C}.{" "}
              This means that the average person in {country.name} earns approximately {f(d.averageSalary.hourly)} {C} for every worked hour.{" "}
              Hourly Wage = Annual Salary ÷ (52 × 5 × 8)
            </p>
          </div>
        </section>

        {/* ==================== COST OF LIVING ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cost of Living in {country.name}</h2>
          <p className="text-sm text-gray-500 mb-4">Estimated monthly expenses</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Rent", value: d.costOfLiving.averageRent, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { label: "Food", value: d.costOfLiving.foodCost, icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Transport", value: d.costOfLiving.transportation, icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
              { label: "Utilities", value: d.costOfLiving.utilities, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <svg className="w-5 h-5 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-gray-900">{f(item.value)} {C}</p>
                <p className="text-[10px] text-gray-400">/month</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="mb-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-6 py-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Compare Your Salary</h2>
          <p className="text-sm text-emerald-100 mb-6">
            See how your salary compares with the average in {country.name} and explore top-paying jobs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/best-paying-jobs-in/${country.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              View Top Jobs in {country.name}
            </Link>
            <Link
              href={`/cost-of-living/${country.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Cost of Living in {country.name}
            </Link>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
                What is the average salary in {country.name}?
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500">
                The average salary in {country.name} is approximately {f(d.averageSalary.annual)} {C} per year, or{" "}
                {f(d.averageSalary.monthly)} {C} per month before taxes. Salaries range from{" "}
                {f(d.salaryDistribution.minimum)} {C} (minimum) to {f(d.salaryDistribution.maximum)} {C} (maximum).
              </div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
                What is the difference between median and average salary?
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500">
                The median salary ({f(d.salaryDistribution.median)} {C}) is the middle value — 50% earn more and 50% earn less.{" "}
                The average ({f(d.salaryDistribution.average)} {C}) is the sum of all salaries divided by the number of workers.{" "}
                If your salary is higher than both, you are doing very well. If lower than both, there is room for improvement.
              </div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
                Which careers pay the most in {country.name}?
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500">
                The highest paying industries in {country.name} include{" "}
                {topIndustries.map((i) => i.name).slice(0, 3).join(", ")}.{" "}
                <Link href={`/best-paying-jobs-in/${country.slug}`} className="text-emerald-600 hover:underline">
                  View all top jobs →
                </Link>
              </div>
            </details>
            <details className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
              <summary className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
                How is this salary data calculated?
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500">{data.metadata.methodology}</div>
            </details>
          </div>
        </section>
      </main>

      <section className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Other Countries</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {countries
              .filter((x) => x.slug !== country.slug)
              .sort(() => Math.random() - 0.5)
              .slice(0, 12)
              .map((oc) => (
                <Link
                  key={oc.code}
                  href={`/average-salary/${oc.slug}`}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-3 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {oc.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-6 bg-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Salary data on this page is based on research from the{" "}
            <a href="https://www.erieri.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Economic Research Institute (ERI)</a>{" "}
            and{" "}
            <a href="https://www.salaryexpert.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">SalaryExpert</a>.{" "}
            Figures are estimates and may vary based on experience, location, industry, and other factors.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
