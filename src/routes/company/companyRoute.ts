import { Router } from "express";
import tryCatch from "utils/tryCatch";
import CompanyController from "./companyController";

const companyRouter = Router();
const companyController = new CompanyController();

companyRouter.get("/", tryCatch(companyController.getCompanies));
companyRouter.post("/", tryCatch(companyController.postCompany));
companyRouter.delete("/:id", tryCatch(companyController.deleteCompany));

export default companyRouter;
