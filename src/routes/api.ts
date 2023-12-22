import { Router } from "express";
import companyRouter from "./company/companyRoute";
import personnelRouter from "./personnel/personnelRoute";

const router = Router();

router.use("/personnel", personnelRouter);
router.use("/company", companyRouter);

export default router;
