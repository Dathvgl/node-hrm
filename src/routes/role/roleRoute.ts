import { Router } from "express";
import tryCatch from "utils/tryCatch";
import RoleController from "./roleController";

const roleRouter = Router();
const roleController = new RoleController();

roleRouter.get("/all", tryCatch(roleController.getRoleAll));

export default roleRouter;
