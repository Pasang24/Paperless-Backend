import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { getUser } from "../services/user.service";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; name: string; email: string };
  }
}

interface DecodedJWT extends JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decodedJwt = jwt.verify(token, env.JWT_SECRET) as DecodedJWT;

  const user = await getUser(decodedJwt.id);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = user;
  next();
};
