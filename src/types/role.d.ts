export type RoleType = {
  id: string;
  stt: number;
  name: string;
};

export type RoleGetAllType = Pick<RoleType, "id" | "stt" | "name">;
