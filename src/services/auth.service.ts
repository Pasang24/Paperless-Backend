import { and, eq } from "drizzle-orm";
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

export const createOAuthUser = async (userData: NewOAuthUser) => {
  const { name, email, provider } = userData;

  const response = await db
    .insert(user)
    .values({
      name,
      email,
      provider,
    })
    .onConflictDoNothing()
    .returning();

  let newUser = response[0];

  if (!newUser) {
    const response = await db
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.provider, provider!)));

    newUser = response[0];
  }

  return newUser;
};
