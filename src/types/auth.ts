import { user } from "../db/schema";

type NewUser = typeof user.$inferInsert;

export interface NewEmailUser
  extends Required<Pick<NewUser, "name" | "email">> {
  provider: "email";
  password: string;
}

export interface NewOAuthUser
  extends Required<Pick<NewUser, "name" | "email">> {
  provider: Exclude<NewUser["provider"], "email">;
}
