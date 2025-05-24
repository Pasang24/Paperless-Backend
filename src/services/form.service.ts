import db from "../db";
import { form } from "../db/schema";
import { NewForm } from "../types/form";

export const createForm = async ({
  title,
  description,
  formSchema,
}: NewForm) => {
  const response = await db
    .insert(form)
    .values({
      title,
      formSchema,
      description,
    })
    .returning();

  const newForm = response[0];

  return newForm;
};
