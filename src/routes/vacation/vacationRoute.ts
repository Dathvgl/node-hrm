import { Router } from "express";
import tryCatch from "utils/tryCatch";
import VacationController from "./vacationController";
import roleHandler from "middlewares/roleHandler";

const vacationRouter = Router();
const vacationController = new VacationController();

vacationRouter.get("/", tryCatch(vacationController.getVacations));
vacationRouter.post("/", tryCatch(vacationController.postVacation));

vacationRouter.put(
  "/status/:id",
  roleHandler(["boss"]),
  tryCatch(vacationController.putVacationStatus)
);

vacationRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(vacationController.deleteVacation)
);

export default vacationRouter;
