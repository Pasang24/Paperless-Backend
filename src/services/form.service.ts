import db from "../db";
import { eq } from "drizzle-orm";
import { form } from "../db/schema";
import { NewForm } from "../types/form";

export const createForm = async ({
  title,
  description,
  formSchema,
  userId,
}: NewForm) => {
  const response = await db
    .insert(form)
    .values({
      title,
      formSchema,
      description,
      userId,
    })
    .returning();

  const newForm = response[0];

  return newForm;
};

export const deleteForm = async (formId: string) => {
  const response = await db.delete(form).where(eq(form.id, formId)).returning();

  const deletedForm = response[0];

  return deletedForm;
};

export const getForm = async (formId: string) => {
  const response = await db
    .select({
      id: form.id,
      title: form.title,
      userId: form.userId,
      description: form.description,
      formSchema: form.formSchema,
    })
    .from(form)
    .where(eq(form.id, formId));

  const currentForm = response[0];

  return currentForm ? currentForm : null;
};

export const getAllForms = async (userId: string) => {
  const response = await db
    .select({
      id: form.id,
      title: form.title,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    })
    .from(form)
    .where(eq(form.userId, userId));

  return response;
};
