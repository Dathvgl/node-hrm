import { BaseMongo } from "./mongo";

export type CompanyType = {
  id: string;
  stt: number;
  code: string;
  name: string;
  address: string;
  constructionYear: string;
  operationYear: string;
};

export type CompaniesGetType = Omit<BaseMongo, "_id"> & CompanyType;
export type CompanyAllGetType = Pick<CompanyType, "id" | "stt" | "name">;
export type CompanyPostType = Omit<CompanyType, "id" | "stt">;
