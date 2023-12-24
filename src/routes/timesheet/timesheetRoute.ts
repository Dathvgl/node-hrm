import { Router } from "express";
import tryCatch from "utils/tryCatch";
import TimesheetController from "./timesheetController";

const timesheetRouter = Router();
const timesheetController = new TimesheetController();

timesheetRouter.get("/", tryCatch(timesheetController.getTimesheets));
timesheetRouter.get("/:id", tryCatch(timesheetController.getTimesheetCurrent));
timesheetRouter.post("/", tryCatch(timesheetController.postTimesheet));
timesheetRouter.put("/day/:id", tryCatch(timesheetController.putTimesheetDay));
timesheetRouter.delete("/:id", tryCatch(timesheetController.deleteTimesheet));

export default timesheetRouter;
