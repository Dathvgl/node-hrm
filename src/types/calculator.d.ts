import { SalaryTypeType } from "./salary";

export type CalculatorSalaryBase = {
  id: string;
  stt: number;
  name: number;
  position: string;
  department: string;
  salaryBase: number;
  salaryAllowance?: number;
  salaryTypeName: string;
  salaryCalc: number;
  salaryBonus?: number;
};

export type CalculatorSalaryInfo =
  | {
      salaryType: "time";
      info: { days: number[]; vacation?: number[] };
    }
  | {
      salaryType: "revenue";
      info: CalculatorSalaryRevenue;
    }
  | {
      salaryType: "contract";
      info: CalculatorSalaryContract;
    }
  | {
      salaryType: "product";
      info: CalculatorSalaryProduct;
    };

export type CalculatorSalaryType = CalculatorSalaryBase & CalculatorSalaryInfo;

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
  "salaryCalc" | "salaryBonus" | "info"
> & {
  salaryTypeCalc: SalaryTypeType;
  days: number[];
  revenues?: CalculatorSalaryRevenue[];
  contracts?: CalculatorSalaryContract[];
  products?: CalculatorSalaryProduct[];
};
