import { Router } from "express";
import tryCatch from "utils/tryCatch";
import DepartmentController from "./departmentController";

const departmentRouter = Router();
const departmentController = new DepartmentController();

departmentRouter.post("/", tryCatch(departmentController.getDepartments));
departmentRouter.post("/", tryCatch(departmentController.postCompany));
departmentRouter.post("/:id", tryCatch(departmentController.deleteDepartment));

export default departmentRouter;
