import { Router } from "express";
import companyRouter from "./company/companyRoute";
import departmentRouter from "./department/departmentRoute";
import personnelRouter from "./personnel/personnelRoute";
import positionRouter from "./position/positionRoute";
import roleRouter from "./role/roleRoute";
import vacationRouter from "./vacation/vacationRoute";

const router = Router();

router.use("/personnel", personnelRouter);
router.use("/company", companyRouter);
router.use("/department", departmentRouter);
router.use("/position", positionRouter);
router.use("/role", roleRouter);
router.use("/vacation", vacationRouter);

export default router;
