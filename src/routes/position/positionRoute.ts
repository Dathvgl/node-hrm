import { Router } from "express";
import tryCatch from "utils/tryCatch";
import PositionController from "./positionController";
import roleHandler from "middlewares/roleHandler";

const positionRouter = Router();
const positionController = new PositionController();

positionRouter.get("/", tryCatch(positionController.getPositions));
positionRouter.get("/:id", tryCatch(positionController.getPositionAll));

positionRouter.post(
  "/",
  roleHandler(["boss", "admin"]),
  tryCatch(positionController.postPosition)
);

positionRouter.delete(
  "/:id",
  roleHandler(["boss", "admin"]),
  tryCatch(positionController.deletePosition)
);

export default positionRouter;
