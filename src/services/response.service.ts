import db from "../db";
import { response } from "../db/schema";
import { NewFormResponse } from "../types/response";

export const createFormResponse = async ({
  formId,
  formResponse,
}: NewFormResponse) => {
  const res = await db
    .insert(response)
    .values({
      formId,
      formResponse,
    })
    .returning();

  const newFormResponse = res[0];

  return newFormResponse;
};
