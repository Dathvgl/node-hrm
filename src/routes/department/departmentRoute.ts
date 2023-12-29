import { Router } from "express";
import tryCatch from "utils/tryCatch";
import DepartmentController from "./departmentController";
import roleHandler from "middlewares/roleHandler";

const departmentRouter = Router();
const departmentController = new DepartmentController();

departmentRouter.get("/", tryCatch(departmentController.getDepartments));
departmentRouter.get("/all", tryCatch(departmentController.getDepartmentAll));

departmentRouter.post(
  "/",
  roleHandler(["boss", "admin"]),
  tryCatch(departmentController.postDepartment)
);

departmentRouter.put(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(departmentController.putDepartment)
);

departmentRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(departmentController.deleteDepartment)
);

export default departmentRouter;
