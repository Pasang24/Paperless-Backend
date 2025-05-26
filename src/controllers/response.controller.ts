import { Request, Response, NextFunction } from "express";
import { NewFormResponse } from "../types/response";
import { createFormResponse } from "../services/response.service";

export const addResponse = async (
  req: Request<{}, {}, NewFormResponse, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId, formResponse } = req.body;

    const newResponse = await createFormResponse({ formId, formResponse });

    res.status(201).json(newResponse);
  } catch (error) {
    next(error);
  }
};
