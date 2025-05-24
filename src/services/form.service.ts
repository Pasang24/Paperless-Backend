import db from "../db";
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
