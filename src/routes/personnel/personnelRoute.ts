import { Router } from "express";
import tryCatch from "utils/tryCatch";
import PersonnelController from "./personnelController";

const personnelRouter = Router();
const personnelController = new PersonnelController();

personnelRouter.get("/all", tryCatch(personnelController.getPersonnelAll));
personnelRouter.get("/:id", tryCatch(personnelController.getPersonnelCurrent));
personnelRouter.get("/one/:id", tryCatch(personnelController.getPersonnelOne));
personnelRouter.get("/", tryCatch(personnelController.getPersonnels));
personnelRouter.post("/", tryCatch(personnelController.postPersonnel));
personnelRouter.put("/company/:id", tryCatch(personnelController.putPersonnelCompany));
personnelRouter.put("/role/:id", tryCatch(personnelController.putPersonnelRoles));
personnelRouter.delete("/:id", tryCatch(personnelController.postPersonnel));

export default personnelRouter;
