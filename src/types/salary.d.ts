import { BaseMongo } from "./mongo";

export type SalaryType = {
  id: string;
  stt: number;
  type: SalaryTypeType;
  name: string;
};

export type SalaryTypeType =
  | "time"
  | "revenue"
  | "contract"
  | "product"
  | "bonus";

export type SalariesGetType = Omit<BaseMongo, "_id"> & SalaryType;
export type SalaryAllGetType = Pick<SalaryType, "id" | "stt" | "name">;
export type SalaryPostType = Omit<SalaryType, "id" | "stt">;

export type SalaryRevenuePostType = {
  day: number;
  month: number;
  year: number;
  salaries: {
    revenue: number;
    percentage: number;
  }[];

};

export type SalaryContractPostType = {
  day: number;
  month: number;
  year: number;
  salaries: {
    base: number;
    percentage: number;
  }[];
};

export type SalaryProductPostType = {
  day: number;
  month: number;
  year: number;
  salaries: {
    base: number;
    quantity: number;
  }[];
};
