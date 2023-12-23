import { BaseMongo } from "./mongo";

export type PositionType = {
  id: string;
  stt: number;
  department: string;
  name: string;
  salary: string;
};

export type PositionsGetType = Omit<BaseMongo, "_id"> & PositionType;
export type PositionAllGetType = Pick<PositionType, "id" | "stt" | "name">;
export type PositionPostType = Omit<PositionType, "id" | "stt">;
