import { Router } from "express";
import tryCatch from "utils/tryCatch";
import SalaryController from "./salaryController";

const salaryRouter = Router();
const salaryController = new SalaryController();

salaryRouter.get("/", tryCatch(salaryController.getSalaries));
salaryRouter.get("/all", tryCatch(salaryController.getSalaryAll));
salaryRouter.post("/", tryCatch(salaryController.postSalary));
salaryRouter.post("/revenue/:id", tryCatch(salaryController.postSalaryRevenue));
salaryRouter.post("/contract/:id", tryCatch(salaryController.postSalaryContract));
salaryRouter.post("/product/:id", tryCatch(salaryController.postSalaryProduct));
salaryRouter.delete("/:id", tryCatch(salaryController.deleteSalary));

export default salaryRouter;
