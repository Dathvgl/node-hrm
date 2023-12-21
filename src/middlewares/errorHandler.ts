import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";

function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AxiosError) {
    res.status(error.response?.status ?? 400).json(error.response?.data);
  } else res.status(400).json({ message: "Error handler", error });
}

export default errorHandler;
