export type DepartmentType = {
  id: string;
  stt: number;
  name: string;
  description: string;
};

export type DepartmentsGetType = Omit<BaseMongo, "_id"> & DepartmentType;
export type DepartmentAllGetType = Pick<DepartmentType, "id" | "stt" | "name">;
export type DepartmentPostType = Omit<DepartmentType, "id" | "stt">;
