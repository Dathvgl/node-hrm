import { Router } from "express";
import tryCatch from "utils/tryCatch";
import PersonnelController from "./personnelController";

const personnelRouter = Router();
const personnelController = new PersonnelController();

personnelRouter.get("/:id", tryCatch(personnelController.getPersonnelCurrent));
personnelRouter.get("/", tryCatch(personnelController.getPersonnels));
personnelRouter.post("/", tryCatch(personnelController.postPersonnel));
personnelRouter.put("/company", tryCatch(personnelController.putPersonnelCompany));
personnelRouter.put("/role", tryCatch(personnelController.putPersonnelRoles));
personnelRouter.delete("/:id", tryCatch(personnelController.postPersonnel));

export default personnelRouter;
