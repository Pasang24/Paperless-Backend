import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  res.status(200).json(user);
};
