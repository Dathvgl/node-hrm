import { Router } from "express";
import tryCatch from "utils/tryCatch";
import CalculatorController from "./calculatorController";

const calculatorRouter = Router();
const calculatorController = new CalculatorController();

calculatorRouter.get("/salary", tryCatch(calculatorController.getCalculatorSalary));

export default calculatorRouter;
