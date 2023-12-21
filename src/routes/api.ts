import { Router } from "express";
import personnelRouter from "./personnel/personnelRoute";

const router = Router();

router.use("/personnel", personnelRouter);

export default router;
