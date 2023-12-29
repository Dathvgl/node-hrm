import { Router } from "express";
import roleHandler from "middlewares/roleHandler";
import tryCatch from "utils/tryCatch";
import CompanyController from "./companyController";

const companyRouter = Router();
const companyController = new CompanyController();

companyRouter.get("/", tryCatch(companyController.getCompanies));
companyRouter.get("/all", tryCatch(companyController.getCompanyAll));

companyRouter.post(
  "/",
  roleHandler(["boss", "admin"]),
  tryCatch(companyController.postCompany)
);

companyRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(companyController.deleteCompany)
);

export default companyRouter;
