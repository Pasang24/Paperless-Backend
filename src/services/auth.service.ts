import db from "../db";
import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { user } from "../db/schema";
import { NewEmailUser, NewOAuthUser, NewUser } from "../types";

export const findUser = async (
  email: string,
  provider: NewUser["provider"]
) => {
  const response = await db
    .select()
    .from(user)
    .where(and(eq(user.email, email), eq(user.provider, provider!)));

  const currentUser = response[0];

  return currentUser ? currentUser : null;
};

export const createEmailUser = async (userData: NewEmailUser) => {
  const { name, email, password } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const response = await db
    .insert(user)
    .values({ name, email, password: hashedPassword })
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
    newUser = (await findUser(email, provider))!;
  }

  return newUser;
};
