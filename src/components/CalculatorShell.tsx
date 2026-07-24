import type { ReactNode } from "react";
import ShareButtons from "@/components/ShareButtons";

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  faqs: FaqItem[];
  children: ReactNode;
}

export default function CalculatorShell({ title, subtitle, description, faqs, children }: Props) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (
    <div>
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-emerald-600 font-medium">
              {subtitle}
            </p>
          )}
          <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        {children}

        <div className="mt-6">
          <ShareButtons title={title} />
        </div>

        <div className="my-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={`/og/calculators/${slug}.webp`}
            alt={title}
            title={`${title} — free online salary calculator`}
            className="w-full h-auto"
            loading="lazy"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
            }}
          />
        </div>

        {faqs.length > 0 && (
          <section className="mt-16 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <svg className="w-5 h-5 text-gray-500 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 py-4 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export const calculatorFaqs: Record<string, { q: string; a: string }[]> = {
  "salary-to-hourly": [
    { q: "How do I calculate my hourly rate from salary?", a: "Divide your annual salary by total working hours per year. Assuming 40 hours/week for 52 weeks (2,080 hours), divide annual salary by 2,080. For monthly salary, multiply by 12 first, then divide by 2,080." },
    { q: "What is the standard work hours per year assumption?", a: "Most calculators use 2,080 hours (40 hours/week × 52 weeks). You can adjust for paid time off by using fewer weeks." },
    { q: "Why should I know my hourly rate?", a: "Knowing your hourly rate helps compare job offers, evaluate freelance or contract work, calculate overtime value, and understand your true time value." },
  ],
  "take-home-salary": [
    { q: "What is the difference between gross and net pay?", a: "Gross pay is your total salary before any deductions. Net pay (take-home pay) is what you actually receive after taxes, Social Security, Medicare, health insurance, retirement contributions, and other deductions are removed." },
    { q: "What common deductions affect take-home pay?", a: "Common deductions include federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), health insurance premiums, 401(k) contributions, and FSA/HSA contributions." },
    { q: "How accurate is this calculator?", a: "This calculator provides estimates based on standard tax brackets and common deductions. Actual take-home pay may vary based on your specific tax situation, filing status, and employer-specific deductions." },
  ],
  "salary-after-tax": [
    { q: "How are federal income taxes calculated?", a: "The US uses a progressive tax system with brackets. For 2025, rates range from 10% to 37%. Your income is taxed at different rates for each bracket portion, not a single rate on your entire income." },
    { q: "Which states have no income tax?", a: "As of 2025, nine states have no income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming." },
    { q: "What is FICA tax?", a: "FICA includes Social Security tax (6.2% up to $168,600 in 2025) and Medicare tax (1.45% on all wages, plus an additional 0.9% on high earners above $200,000 single/$250,000 married)." },
  ],
  "monthly-to-annual": [
    { q: "How do I convert monthly salary to annual?", a: "Simply multiply your monthly gross salary by 12. For example, $5,000/month × 12 = $60,000/year. If paid bi-weekly, multiply by 26 (pay periods) and divide by 12 for monthly." },
    { q: "Should I use gross or net figures?", a: "Always use gross (pre-tax) figures when converting between monthly and annual. Net/take-home amounts already have deductions removed and won't multiply correctly." },
  ],
  "annual-to-monthly": [
    { q: "How do I convert annual salary to monthly?", a: "Divide your annual salary by 12. For example, $60,000/year ÷ 12 = $5,000/month. Note that actual paychecks may vary if you're paid bi-weekly (26 pay periods per year)." },
    { q: "Why does my monthly paycheck sometimes vary?", a: "If paid bi-weekly, you receive 26 paychecks per year. Most months have 2 paychecks, but two months per year have 3, giving those months higher total pay. Monthly salary calculations use the average." },
  ],
  "salary-increase": [
    { q: "How do I calculate a raise percentage?", a: "Subtract your old salary from new salary, divide by old salary, multiply by 100. Example: ($65,000 - $60,000) ÷ $60,000 × 100 = 8.33% raise." },
    { q: "What is a typical annual raise percentage?", a: "Average annual raises typically range from 3-5% for cost-of-living adjustments. Promotion raises are larger, often 10-20% depending on the role and company." },
    { q: "How do I negotiate a raise?", a: "Research market rates for your role using sites like BestPayingJobs.net. Document your achievements and quantifiable impact. Practice your pitch and have a specific number in mind based on data." },
  ],
  "overtime-pay": [
    { q: "What is the standard overtime rate?", a: "Under federal law (FLSA), overtime is 1.5x your regular hourly rate (time-and-a-half) for hours worked beyond 40 in a workweek. Some states have daily overtime rules." },
    { q: "Who qualifies for overtime pay?", a: "Non-exempt employees qualify for overtime. Exempt employees (typically salaried professionals, executives, and administrators meeting salary threshold tests) do not." },
    { q: "How is overtime calculated for salaried employees?", a: "For salaried non-exempt employees, convert your salary to an hourly rate (annual ÷ 2,080 hours), then apply 1.5x for overtime hours. Some employers use a fluctuating workweek method." },
  ],
  bonus: [
    { q: "How are bonuses taxed?", a: "The IRS treats bonuses as supplemental wages. Employers can use the percentage method (flat 22% federal withholding for bonuses under $1 million) or the aggregate method (adds to regular paycheck and taxes at your marginal rate)." },
    { q: "Do bonuses affect my tax bracket?", a: "A large bonus can push you into a higher tax bracket, but only the portion of income in the new bracket is taxed at the higher rate (progressive taxation)." },
    { q: "What is a typical bonus percentage?", a: "Performance bonuses typically range from 5-20% of base salary. Sign-on bonuses vary widely by industry and role. Annual target bonuses are common in finance (20-100%), tech (10-20%), and sales (variable)." },
  ],
  commission: [
    { q: "How do commission structures work?", a: "Common structures include straight commission (percentage of sales only), base salary plus commission, tiered commission (higher rates for exceeding targets), and residual commission (ongoing percentage from recurring sales)." },
    { q: "What is a good commission rate?", a: "Commission rates vary by industry: real estate (5-6% of sale price), retail (2-10% of sale), B2B sales (5-15%), financial services (1-5% of assets). Higher rates typically mean no base salary." },
    { q: "How are commissions taxed?", a: "Commissions are considered supplemental wages and taxed similarly to bonuses — typically 22% federal withholding, plus applicable state taxes and FICA." },
  ],
  "rent-affordability": [
    { q: "What is the 30% rule for rent?", a: "The 30% rule states you should spend no more than 30% of your gross monthly income on housing. For $60,000/year ($5,000/month), max rent would be $1,500/month." },
    { q: "Can I afford rent if I have student loans?", a: "Lenders often use the 43% debt-to-income ratio — total monthly debts (including rent, loans, credit cards) shouldn't exceed 43% of gross income. With high debt, reduce your rent budget accordingly." },
    { q: "What if I live in an expensive city?", a: "In high-cost areas like NYC or San Francisco, many people spend 40-50% of income on rent. While not ideal, focus on keeping other costs low and prioritizing savings." },
  ],
  "house-affordability": [
    { q: "What is the 28/36 rule?", a: "The 28/36 rule says spend no more than 28% of gross monthly income on housing costs (mortgage, taxes, insurance) and no more than 36% on total debt (housing plus other debts)." },
    { q: "How much down payment do I need?", a: "Conventional loans typically require 3-20% down. FHA loans allow 3.5%. VA and USDA loans may require 0% down. Putting 20% avoids private mortgage insurance (PMI)." },
    { q: "How does interest rate affect affordability?", a: "Higher rates significantly reduce buying power. At 6% vs 7%, on a $400,000 loan, the monthly payment difference is about $270/month, translating to roughly $50,000 in borrowing power." },
  ],
  "car-affordability": [
    { q: "What percentage of salary should go to a car?", a: "Financial experts recommend total car costs (payment, insurance, fuel, maintenance) stay under 10-15% of monthly take-home pay. The car payment alone should not exceed 8-10%." },
    { q: "Should I lease or buy?", a: "Buying is better long-term (you own the asset). Leasing offers lower payments and new cars every few years but has mileage limits and no equity. Choose based on driving habits and financial goals." },
    { q: "How does my credit score affect car buying?", a: "A higher credit score qualifies you for lower interest rates. The difference between excellent (740+) and fair (620-679) credit can mean thousands in extra interest over a 5-year loan." },
  ],
  "salary-vs-cost-of-living": [
    { q: "How is cost of living calculated?", a: "Cost of living indices compare prices for housing, food, transportation, healthcare, and goods across locations. The national average is typically 100. A city with 120 is 20% more expensive." },
    { q: "What salary do I need to maintain my lifestyle in a new city?", a: "Multiply your current salary by (target city COL ÷ current city COL). If you earn $70,000 in a 100-index city and move to a 150-index city, you'd need $105,000 for the same lifestyle." },
    { q: "Why consider cost of living in job offers?", a: "A $100,000 salary in San Francisco provides a lower standard of living than $70,000 in Austin due to housing costs. Always compare offers using cost-of-living-adjusted figures." },
  ],
  "salary-inflation": [
    { q: "How does inflation affect my salary?", a: "Inflation reduces purchasing power. At 3% annual inflation, $100 today will be worth about $74 in 10 years. Your salary needs to increase at least at the inflation rate just to maintain your standard of living." },
    { q: "What is the average inflation rate?", a: "The Federal Reserve targets 2% annual inflation. Historical average since 1913 is about 3.3%. Recent years have seen higher rates (4-9% in 2021-2023)." },
    { q: "How much should my raise be to keep up with inflation?", a: "Your raise should at least match inflation. If inflation is 3%, a 3% raise maintains purchasing power. To actually gain purchasing power, your raise needs to exceed inflation by 1-2%." },
  ],
  "salary-comparison": [
    { q: "What factors should I consider when comparing salaries?", a: "Consider base salary, bonuses, equity/stock options, retirement contributions, health insurance value, PTO, commute costs, cost of living, career growth potential, and work-life balance." },
    { q: "How do I value benefits in a job offer?", a: "Health insurance: $5,000-20,000/year employer contribution. 401k match: 3-6% of salary. PTO: 10-25 days worth ~4-10% of salary. Equity: varies widely. Add 20-40% to base salary for total compensation." },
    { q: "Should I prioritize salary over benefits?", a: "Consider your personal situation. High salary with poor benefits may cost more in healthcare expenses. A lower salary with excellent benefits (full healthcare, large 401k match, generous PTO) can be more valuable." },
  ],
  "salary-percentile": [
    { q: "What do salary percentiles mean?", a: "If you're in the 75th percentile, you earn more than 75% of people in your category. The 50th percentile is the median — half earn more, half earn less. Higher percentiles indicate higher relative earnings." },
    { q: "How accurate are salary percentiles?", a: "Percentile data comes from surveys, tax data, and job postings. Accuracy depends on sample size and data source. Use multiple sources and consider your specific industry, experience, and location." },
    { q: "What is a good salary percentile to aim for?", a: "The 75th percentile (top 25%) is a solid target for experienced professionals. The 90th percentile (top 10%) is excellent. Focus on skills, certifications, and experience that command premium compensation." },
  ],
  "salary-savings": [
    { q: "What is a good savings rate?", a: "Financial experts recommend saving 15-20% of your gross income for retirement. The FIRE movement targets 50-70% for early retirement. Start with any amount and increase over time as your income grows." },
    { q: "How much should I have saved by age?", a: "General benchmarks: 1x salary by 30, 3x by 40, 6x by 50, 8x by 60. These vary based on lifestyle, retirement goals, and other income sources like Social Security or pensions." },
    { q: "What's the difference between saving and investing?", a: "Saving keeps money in low-risk accounts (savings accounts, CDs) earning 1-5%. Investing puts money in assets (stocks, bonds, real estate) with potential for 7-10% average annual returns but greater risk and volatility." },
  ],
  "fire-calculator": [
    { q: "What is the 4% rule?", a: "The 4% rule states you can withdraw 4% of your investment portfolio annually in retirement without running out of money for 30+ years. Your FIRE number = annual expenses ÷ 0.04 (or × 25)." },
    { q: "What's the difference between FIRE and traditional retirement?", a: "FIRE aims for financial independence and early retirement, often in your 30s-50s rather than 60s-70s. It requires higher savings rates (50-70% of income) and focuses on building a portfolio that covers living expenses indefinitely." },
    { q: "What is Coast FIRE / Lean FIRE / Fat FIRE?", a: "Lean FIRE: retiring on minimal expenses ($25-40k/year). Fat FIRE: retiring with comfortable spending ($80k+/year). Coast FIRE: having enough saved that it will grow to your FIRE number by traditional retirement age without additional contributions." },
  ],
  "job-offer-comparison": [
    { q: "What should I include in total compensation?", a: "Base salary + guaranteed bonus + signing bonus + equity value per year + 401k match + health insurance value + other benefits (tuition reimbursement, gym, etc.) + PTO monetized value - commute costs." },
    { q: "How do I value equity or stock options?", a: "For public companies, use current stock price × number of shares vesting per year. For private companies, value is uncertain — consider it a potential upside but don't rely on it for essential expenses." },
    { q: "How does cost of living change the comparison?", a: "A $120k job in San Francisco may be worth less than a $90k job in Austin. Use cost-of-living calculators to adjust offers to a common location for fair comparison." },
  ],
  "freelance-hourly-rate": [
    { q: "How do I calculate my freelance hourly rate from salary?", a: "Take your desired annual salary, add 25-35% for taxes (self-employment tax), add business expenses, divide by billable hours per year (typically 1,000-1,500). Example: $100k target ÷ 1,200 billable hours = ~$83/hr." },
    { q: "Why do freelancers charge more than employees?", a: "Freelancers pay both employer and employee portions of FICA tax (15.3% vs 7.65%), cover their own benefits (health insurance, PTO, sick days), and have unbillable time for admin, marketing, and business development." },
    { q: "How many billable hours should I expect?", a: "Full-time freelancers typically bill 1,000-1,500 hours per year out of 2,080 potential. The rest goes to marketing, proposals, admin, accounting, professional development, and time off. 1,200 billable hours (25/week) is a realistic target." },
  ],
};
