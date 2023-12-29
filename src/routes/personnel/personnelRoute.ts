import { Router } from "express";
import tryCatch from "utils/tryCatch";
import PersonnelController from "./personnelController";
import roleHandler from "middlewares/roleHandler";

const personnelRouter = Router();
const personnelController = new PersonnelController();

personnelRouter.get("/all", tryCatch(personnelController.getPersonnelAll));
personnelRouter.get("/:id", tryCatch(personnelController.getPersonnelCurrent));
personnelRouter.get("/one/:id", tryCatch(personnelController.getPersonnelOne));
personnelRouter.get("/", tryCatch(personnelController.getPersonnels));

personnelRouter.post(
  "/",
  roleHandler(["boss", "admin"]),
  tryCatch(personnelController.postPersonnel)
);

personnelRouter.put(
  "/company/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(personnelController.putPersonnelCompany)
);

personnelRouter.put(
  "/role/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(personnelController.putPersonnelRoles)
);

personnelRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(personnelController.deletePersonnel)
);

export default personnelRouter;
