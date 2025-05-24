import { NextFunction, Request, Response } from "express";
import { NewForm } from "../types/form";
import { createForm } from "../services/form.service";

export const addForm = async (
  req: Request<{}, {}, NewForm, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description = "", formSchema } = req.body;
    const { id } = req.user!;

    const newForm = await createForm({
      userId: id,
      title,
      description,
      formSchema,
    });

    res.status(201).send(newForm);
  } catch (error) {
    next(error);
  }
};
