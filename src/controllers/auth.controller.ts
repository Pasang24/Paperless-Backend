import { NextFunction, Request, Response } from "express";
import {
  createEmailUser,
  createOAuthUser,
  findUser,
} from "../services/auth.service";
import { NewEmailUser } from "../types";
import { generateSession } from "../utils/generateSession";
import { env } from "../config/env";
import { googleStrategy } from "../oAuthStrategy/googleStrategy";
import { githubStrategy } from "../oAuthStrategy/githubStrategy";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";

export const emailRegister = async (
  req: Request<{}, {}, NewEmailUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, provider } = req.body;

    const newUser = await createEmailUser({
      name,
      email,
      password,
      provider,
    });

    if (!newUser) {
      throw new ApiError(409, "User already exists");
    }

    const { id } = newUser;

    generateSession(res, id);

    res.status(201).send({ id, email, name });
  } catch (error) {
    next(error);
  }
};

export const emailLogin = async (
  req: Request<{}, {}, { email: string; password: string }, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const currentUser = await findUser(email, "email");

    if (!currentUser) {
      throw new ApiError(401, "Invalid Email or Password");
    }

    const isMatch = await bcrypt.compare(password, currentUser.password!);

    if (!isMatch) {
      throw new ApiError(401, "Invalid Email or Password");
    }

    const { id, name } = currentUser;

    generateSession(res, id);

    res.status(200).send({ id, email, name });
  } catch (error) {
    next(error);
  }
};

export const googleLoginRedirect = (req: Request, res: Response) => {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: `${env.BACKEND_URL}/auth/google/callback`,
      response_type: "code",
      scope: "email profile",
    });

  res.redirect(redirectUrl);
};

export const googleLoginCallback = async (
  req: Request<{}, {}, {}, { code?: string; error?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.redirect(`${env.FRONTEND_URL}/login`);
      return;
    }

    if (!code) {
      throw new ApiError(400, "Missing authorization code");
    }

    const profile = await googleStrategy(
      code,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${env.BACKEND_URL}/auth/google/callback`
    );

    const newUser = await createOAuthUser({
      email: profile.email,
      name: profile.name,
      provider: "google",
    });

    const token = generateSession(res, newUser.id);

    res.redirect(`${env.FRONTEND_URL}/api/auth/oAuth?token=${token}`);
  } catch (error) {
    next(error);
  }
};

export const githubLoginRedirect = (req: Request, res: Response) => {
  const redirectUrl =
    "https://github.com/login/oauth/authorize?" +
    new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID as string,
      redirect_uri: `${env.BACKEND_URL}/auth/github/callback`,
      prompt: "select_account",
      scope: "read:user user:email",
    });

  res.redirect(redirectUrl);
};

export const githubLoginCallback = async (
  req: Request<{}, {}, {}, { code?: string; error?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.redirect(`${env.FRONTEND_URL}/login`);
      return;
    }

    if (!code) {
      throw new ApiError(400, "Missing authorization code");
    }

    const profile = await githubStrategy(
      code,
      env.GITHUB_CLIENT_ID,
      env.GITHUB_CLIENT_SECRET,
      `${env.BACKEND_URL}/auth/github/callback`
    );

    const newUser = await createOAuthUser({
      email: profile.email,
      name: profile.name,
      provider: "github",
    });

    const token = generateSession(res, newUser.id);

    res.redirect(`${env.FRONTEND_URL}/api/auth/oAuth?token=${token}`);
  } catch (error) {
    next(error);
  }
};
