import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const form = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").default(""),
  formSchema: jsonb("form_schema").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
