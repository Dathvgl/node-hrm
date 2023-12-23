import { Router } from "express";
import tryCatch from "utils/tryCatch";
import VacationController from "./vacationController";

const vacationRouter = Router();
const vacationController = new VacationController();

vacationRouter.get("/", tryCatch(vacationController.getVacations));
vacationRouter.post("/", tryCatch(vacationController.postVacation));
vacationRouter.put(
  "/status/:id",
  tryCatch(vacationController.putVacationStatus)
);
vacationRouter.delete("/:id", tryCatch(vacationController.deleteVacation));

export default vacationRouter;
