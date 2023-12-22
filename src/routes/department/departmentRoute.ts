import { Router } from "express";
import tryCatch from "utils/tryCatch";
import DepartmentController from "./departmentController";

const departmentRouter = Router();
const departmentController = new DepartmentController();

departmentRouter.get("/", tryCatch(departmentController.getDepartments));
departmentRouter.get("/all", tryCatch(departmentController.getDepartmentAll));
departmentRouter.post("/", tryCatch(departmentController.postDepartment));
departmentRouter.delete(
  "/:id",
  tryCatch(departmentController.deleteDepartment)
);

export default departmentRouter;
