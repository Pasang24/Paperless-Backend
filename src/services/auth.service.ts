import db from "../db";
import { user } from "../db/schema";
import { NewEmailUser, NewOAuthUser } from "../types";

export const createEmailUser = async (userData: NewEmailUser) => {
  const { name, email, password } = userData;

  const response = await db
    .insert(user)
    .values({ name, email, password })
    .onConflictDoNothing()
    .returning();

  const newUser = response[0];

  return newUser ? newUser : null;
};

export const createOAuthUser = (userData: NewOAuthUser) => {};
