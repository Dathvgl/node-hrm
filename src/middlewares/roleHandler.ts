import { NextFunction, Request, Response } from "express";
import { PersonnelRoleType } from "types/personnel";

export default function roleHandler(roles: PersonnelRoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.length == 0) {
      next();
    } else {
      if (typeof req.headers.roles == "string") {
        const rolesRequest = req.headers.roles?.split("|");

        const check = rolesRequest.some((item) => {
          return roles.includes(item as PersonnelRoleType);
        });

        if (check) {
          next();
        } else res.status(400).json({ message: "Không đủ quyền" });
      } else res.status(400).json({ message: "Không đủ quyền" });
    }
  };
}
