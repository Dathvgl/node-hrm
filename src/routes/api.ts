import { Router } from "express";
import companyRouter from "./company/companyRoute";
import departmentRouter from "./department/departmentRoute";
import personnelRouter from "./personnel/personnelRoute";

const router = Router();

router.use("/personnel", personnelRouter);
router.use("/company", companyRouter);
router.use("/department", departmentRouter);

export default router;
