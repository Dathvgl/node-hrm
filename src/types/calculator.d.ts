export type CalculatorSalaryType = {
  id: string;
  stt: number;
  name: number;
  position: string;
  department: string;
  salaryBase: number;
  salaryType: string;
  salaryAllowance?: number;
  salaryCalc: number;
  salaryBonus?: number;
};

export type CalculatorSalaryRevenue = {
  salaries: { revenue: number; percentage: number }[];
};

export type CalculatorSalaryContract = {
  salaries: { base: number; percentage: number }[];
};

export type CalculatorSalaryProduct = {
  salaries: { base: number; quantity: number }[];
};

export type CalculatorSalaryAggregateType = Omit<
  CalculatorSalaryType,
  "salaryCalc" | "salaryBonus"
> & {
  salaryTypeCalc: SalaryTypeType;
  days: number[];
  revenues?: CalculatorSalaryRevenue[];
  contracts?: CalculatorSalaryContract[];
  products?: CalculatorSalaryProduct[];
};
