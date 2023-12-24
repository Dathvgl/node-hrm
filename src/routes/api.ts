import { Router } from "express";
import calculatorRouter from "./calculator/calculatorRoute";
import companyRouter from "./company/companyRoute";
import departmentRouter from "./department/departmentRoute";
import personnelRouter from "./personnel/personnelRoute";
import positionRouter from "./position/positionRoute";
import roleRouter from "./role/roleRoute";
import salaryRouter from "./salary/salaryRoute";
import timesheetRouter from "./timesheet/timesheetRoute";
import vacationRouter from "./vacation/vacationRoute";

const router = Router();

router.use("/personnel", personnelRouter);
router.use("/company", companyRouter);
router.use("/department", departmentRouter);
router.use("/position", positionRouter);
router.use("/role", roleRouter);
router.use("/vacation", vacationRouter);
router.use("/timesheet", timesheetRouter);
router.use("/salary", salaryRouter);
router.use("/calculator", calculatorRouter);

export default router;
