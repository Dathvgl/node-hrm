export type PersonnelType = {
  id: string;
  stt: number;
  name: string;
  position: string;
  department: string;
  phone: string;
  birth: string;
  address: string;
  email: string;
  roles: PersonnelRoleType[];
  company: string;
};

export type PersonnelsGetManagement = Omit<BaseMongo, "_id"> &
  Omit<PersonnelType, "salary" | "roles">;

export type PersonnelsGetCompany = Omit<BaseMongo, "_id"> &
  Pick<PersonnelType, "id" | "stt" | "name" | "company">;

export type PersonnelsGetRoles = Omit<BaseMongo, "_id"> &
  Pick<PersonnelType, "id" | "stt" | "name" | "roles">;

export type PersonnelRoleType = "staff" | "manager" | "admin" | "boss";

export type PersonnelCurrentType = Pick<
  PersonnelType,
  "id" | "name" | "email" | "roles"
>;

export type PersonnelPostType = Omit<
  PersonnelType,
  "id" | "stt" | "company" | "roles"
>;
