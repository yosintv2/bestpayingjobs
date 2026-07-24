import SalaryToHourly from "./SalaryToHourly";
import TakeHomeSalary from "./TakeHomeSalary";
import SalaryAfterTax from "./SalaryAfterTax";
import MonthlyToAnnual from "./MonthlyToAnnual";
import AnnualToMonthly from "./AnnualToMonthly";
import SalaryIncrease from "./SalaryIncrease";
import OvertimePay from "./OvertimePay";
import Bonus from "./Bonus";
import Commission from "./Commission";
import RentAffordability from "./RentAffordability";
import HouseAffordability from "./HouseAffordability";
import CarAffordability from "./CarAffordability";
import SalaryVsCostOfLiving from "./SalaryVsCostOfLiving";
import SalaryInflation from "./SalaryInflation";
import SalaryComparison from "./SalaryComparison";
import SalaryPercentile from "./SalaryPercentile";
import SalarySavings from "./SalarySavings";
import FireCalculator from "./FireCalculator";
import JobOfferComparison from "./JobOfferComparison";
import FreelanceHourlyRate from "./FreelanceHourlyRate";

export const calculatorComponents: Record<string, React.ComponentType> = {
  "salary-to-hourly": SalaryToHourly,
  "take-home-salary": TakeHomeSalary,
  "salary-after-tax": SalaryAfterTax,
  "monthly-to-annual": MonthlyToAnnual,
  "annual-to-monthly": AnnualToMonthly,
  "salary-increase": SalaryIncrease,
  "overtime-pay": OvertimePay,
  bonus: Bonus,
  commission: Commission,
  "rent-affordability": RentAffordability,
  "house-affordability": HouseAffordability,
  "car-affordability": CarAffordability,
  "salary-vs-cost-of-living": SalaryVsCostOfLiving,
  "salary-inflation": SalaryInflation,
  "salary-comparison": SalaryComparison,
  "salary-percentile": SalaryPercentile,
  "salary-savings": SalarySavings,
  "fire-calculator": FireCalculator,
  "job-offer-comparison": JobOfferComparison,
  "freelance-hourly-rate": FreelanceHourlyRate,
};
