import db from "../db";
import { eq } from "drizzle-orm";
import { user } from "../db/schema";

export const getUser = async (userId: string) => {
  const response = await db
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, userId));

  const currentUser = response[0];

  return currentUser ? currentUser : null;
};
