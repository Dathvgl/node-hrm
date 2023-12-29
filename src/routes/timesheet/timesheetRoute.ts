import { Router } from "express";
import tryCatch from "utils/tryCatch";
import TimesheetController from "./timesheetController";
import roleHandler from "middlewares/roleHandler";

const timesheetRouter = Router();
const timesheetController = new TimesheetController();

timesheetRouter.get("/", tryCatch(timesheetController.getTimesheets));
timesheetRouter.get("/:id", tryCatch(timesheetController.getTimesheetCurrent));
timesheetRouter.post("/", tryCatch(timesheetController.postTimesheet));
timesheetRouter.put("/day/:id", tryCatch(timesheetController.putTimesheetDay));

timesheetRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(timesheetController.deleteTimesheet)
);

export default timesheetRouter;
