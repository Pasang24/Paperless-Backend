import { response } from "../db/schema";

export type FormResponse = typeof response.$inferSelect;

export type NewFormResponse = Pick<FormResponse, "formId" | "formResponse">;
