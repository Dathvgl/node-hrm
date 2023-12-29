import { Router } from "express";
import roleHandler from "middlewares/roleHandler";
import tryCatch from "utils/tryCatch";
import SalaryController from "./salaryController";

const salaryRouter = Router();
const salaryController = new SalaryController();

salaryRouter.get("/", tryCatch(salaryController.getSalaries));
salaryRouter.get("/all", tryCatch(salaryController.getSalaryAll));
salaryRouter.post("/", tryCatch(salaryController.postSalary));
salaryRouter.post("/revenue/:id", tryCatch(salaryController.postSalaryRevenue));

salaryRouter.post(
  "/contract/:id",
  tryCatch(salaryController.postSalaryContract)
);

salaryRouter.post("/product/:id", tryCatch(salaryController.postSalaryProduct));

salaryRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(salaryController.deleteSalary)
);

export default salaryRouter;
