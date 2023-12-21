export type PersonnelType = {
  id: string;
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

export type PersonnelRoleType = "staff" | "manager" | "admin" | "boss";

export type PersonnelCurrentType = Pick<
  PersonnelType,
  "id" | "name" | "email" | "roles"
>;

export type PersonnelPostType = Omit<PersonnelType, "id" | "company" | "roles">;
