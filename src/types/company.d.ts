export type CompanyType = {
  id: string;
  stt: number;
  code: string;
  name: string;
  address: string;
  constructionYear: string;
  operationYear: string;
};

export type CompanyPostType = Omit<CompanyType, "id" | "stt">;
