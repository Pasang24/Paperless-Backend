import { NextFunction, Request, Response } from "express";
import { NewForm } from "../types/form";
import {
  createForm,
  deleteForm,
  getAllForms,
  getForm,
} from "../services/form.service";
import { ApiError } from "../utils/ApiError";

export const addForm = async (
  req: Request<{}, {}, NewForm, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description = "", formSchema } = req.body;
    const { user } = req;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const newForm = await createForm({
      userId: user.id,
      title,
      description,
      formSchema,
    });

    res.status(201).send(newForm);
  } catch (error) {
    next(error);
  }
};

export const removeForm = async (
  req: Request<{}, {}, {}, { formId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.query;
    const { user } = req;

    if (!formId) {
      throw new ApiError(400, "Form ID is required");
    }

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const form = await getForm(formId);

    if (!form) {
      throw new ApiError(404, "Invalid Form ID");
    }

    if (form.userId !== user.id) {
      throw new ApiError(403, "User forbidden to delete this form");
    }

    const deletedForm = await deleteForm(formId);

    res.status(200).json(deletedForm);
  } catch (error) {
    next(error);
  }
};

export const getMyForms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const myForms = await getAllForms(user.id);

    res.status(200).json(myForms);
  } catch (error) {
    next(error);
  }
};

export const viewForm = async (
  req: Request<{ formId: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      throw new ApiError(400, "Invalid Form ID");
    }

    const currentForm = await getForm(formId);

    if (!currentForm) {
      throw new ApiError(400, "Invalid Form ID");
    }

    res.status(200).json(currentForm);
  } catch (error) {
    next(error);
  }
};
