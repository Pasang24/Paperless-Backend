import { form } from "../db/schema";

export type Form = typeof form.$inferSelect;

export type NewForm = Pick<
  Form,
  "title" | "description" | "formSchema" | "userId"
>;
