import { NextFunction, Request, Response } from "express";

export default function tryCatch(
  controller: (req: Request, res: Response) => Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
}
