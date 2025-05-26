import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { form } from "./form";

export const response = pgTable("response", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => form.id, {
      onDelete: "cascade",
    }),
  formResponse: jsonb("form_response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
