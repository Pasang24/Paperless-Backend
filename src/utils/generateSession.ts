import { Response } from "express";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

export const generateSession = (res: Response, userId: string) => {
  const sessionToken = jwt.sign({ id: userId }, env.JWT_SECRET);
  res.cookie("token", sessionToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
