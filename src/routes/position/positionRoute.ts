import { Router } from "express";
import tryCatch from "utils/tryCatch";
import PositionController from "./positionController";

const positionRouter = Router();
const positionController = new PositionController();

positionRouter.get("/", tryCatch(positionController.getPositions));
positionRouter.get("/:id", tryCatch(positionController.getPositionAll));
positionRouter.post("/", tryCatch(positionController.postPosition));
positionRouter.delete("/:id", tryCatch(positionController.deletePosition));

export default positionRouter;
