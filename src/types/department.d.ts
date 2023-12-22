export type DepartmentType = {
  id: string;
  stt: number;
  name: string;
  decription: string;
};

export type DepartmentPostType = Omit<DepartmentType, "id" | "stt">;
