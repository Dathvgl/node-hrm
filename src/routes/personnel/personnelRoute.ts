import { Router } from "express";
import tryCatch from "utils/tryCatch";
import PersonnelController from "./personnelController";

const personnelRouter = Router();
const personnelController = new PersonnelController();

personnelRouter.post("/", tryCatch(personnelController.postPersonnel));

export default personnelRouter;
