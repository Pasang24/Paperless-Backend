import { Request, Response } from "express";
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

export const emailRegister = async (
  req: Request<{}, {}, NewEmailUser>,
  res: Response
) => {
  const { name, email, password, provider } = req.body;

  const newUser = await createEmailUser({
    name,
    email,
    password,
    provider,
  });

  if (!newUser) {
    res.status(409).send({ message: "User already exists" });
    return;
  }

  generateSession(res, newUser.id);

  res.status(204).send();
};

export const emailLogin = async (
  req: Request<{}, {}, { email: string; password: string }, {}>,
  res: Response
) => {
  const { email, password } = req.body;

  const currentUser = await findUser(email, "email");

  if (!currentUser) {
    res.status(401).json({ message: "Invalid Email or Password" });
    return;
  }

  const isMatch = password === currentUser.password;

  if (!isMatch) {
    res.status(401).json({ message: "Invalid Email or Password" });
    return;
  }

  generateSession(res, currentUser.id);

  res.status(204).send();
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
  res: Response
) => {
  const { code, error } = req.query;

  if (!code) {
    throw new Error("Missing authorization code");
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

  generateSession(res, newUser.id);

  res.redirect(env.FRONTEND_URL);
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
  res: Response
) => {
  const { code, error } = req.query;

  if (!code) {
    throw new Error("Missing authorization code");
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

  generateSession(res, newUser.id);

  res.redirect(env.FRONTEND_URL);
};
