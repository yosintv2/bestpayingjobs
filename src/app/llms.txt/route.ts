import { getCountries, getCategories, getCurrentYear } from "@/lib/db";

export async function GET() {
  const year = getCurrentYear();
  const countries = getCountries();
  const categories = getCategories();

  const content = `# BestPayingJobs.net

> Compare salaries and discover the highest paying jobs in ${countries.length} countries across ${categories.length} career categories. Updated for ${year}.

## About

BestPayingJobs.net provides salary comparison data for every country in the world. Users can explore the highest paying jobs by country, career category, or city. The site includes interactive salary calculators, country comparison tools, and a global job ranking.

## Key Features

- **Country Pages**: Salary data for all ${categories.length} career categories in ${countries.length} countries
- **City Pages**: City-specific salary estimates for capitals and major cities (691 cities)
- **Global Ranking**: Top 100 highest paying jobs worldwide
- **Country Comparison**: Side-by-side salary comparison between any two countries
- **Salary Calculators**: 20 free calculators for salary conversion, taxes, affordability, FIRE, and more
- **Career Categories**: ${categories.length} categories including AI, Finance, Healthcare, Engineering, IT, and more

## Key Pages

- Home: https://www.bestpayingjobs.net/
- All Categories: https://www.bestpayingjobs.net/jobs
- Global Ranking: https://www.bestpayingjobs.net/global-ranking
- Calculators: https://www.bestpayingjobs.net/calculator
- Compare: https://www.bestpayingjobs.net/compare
- Blog: https://www.bestpayingjobs.net/blog
- Salary Letters: https://www.bestpayingjobs.net/salary-increase-letter

## Example Country Pages

${countries.slice(0, 10).map((c) => `- ${c.name}: https://www.bestpayingjobs.net/best-paying-jobs-in-${c.slug}`).join("\n")}

## All Countries

${countries.map((c) => `- ${c.name}: https://www.bestpayingjobs.net/best-paying-jobs-in-${c.slug}`).join("\n")}

## All Career Categories

${categories.map((cat) => `- ${cat.name}: https://www.bestpayingjobs.net/jobs/${cat.slug}`).join("\n")}

## All Calculators

- Salary to Hourly Wage: https://www.bestpayingjobs.net/calculator/salary-to-hourly
- Take-Home Salary: https://www.bestpayingjobs.net/calculator/take-home-salary
- Salary After Tax: https://www.bestpayingjobs.net/calculator/salary-after-tax
- Monthly to Annual: https://www.bestpayingjobs.net/calculator/monthly-to-annual
- Annual to Monthly: https://www.bestpayingjobs.net/calculator/annual-to-monthly
- Salary Increase: https://www.bestpayingjobs.net/calculator/salary-increase
- Overtime Pay: https://www.bestpayingjobs.net/calculator/overtime-pay
- Bonus: https://www.bestpayingjobs.net/calculator/bonus
- Commission: https://www.bestpayingjobs.net/calculator/commission
- Rent Affordability: https://www.bestpayingjobs.net/calculator/rent-affordability
- Home Affordability: https://www.bestpayingjobs.net/calculator/house-affordability
- Car Affordability: https://www.bestpayingjobs.net/calculator/car-affordability
- Cost of Living: https://www.bestpayingjobs.net/calculator/salary-vs-cost-of-living
- Salary Inflation: https://www.bestpayingjobs.net/calculator/salary-inflation
- Salary Comparison: https://www.bestpayingjobs.net/calculator/salary-comparison
- Salary Percentile: https://www.bestpayingjobs.net/calculator/salary-percentile
- Savings: https://www.bestpayingjobs.net/calculator/salary-savings
- FIRE Calculator: https://www.bestpayingjobs.net/calculator/fire-calculator
- Job Offer Comparison: https://www.bestpayingjobs.net/calculator/job-offer-comparison
- Freelance Rate: https://www.bestpayingjobs.net/calculator/freelance-hourly-rate

## Data Sources

Salary data is compiled from national labor statistics, job posting aggregators, and industry surveys. All salaries are shown in local currency with USD equivalents.`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
