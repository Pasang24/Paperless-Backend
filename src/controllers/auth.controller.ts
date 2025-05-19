import { Request, Response } from "express";
import { createEmailUser } from "../services/auth.service";
import { NewEmailUser, NewOAuthUser } from "../types";
import { generateSession } from "../utils/generateSession";

export const createUser = async (
  req: Request<{}, {}, NewEmailUser | NewOAuthUser>,
  res: Response
) => {
  const { name, email, provider } = req.body;

  switch (provider) {
    case "email":
      const { password } = req.body;
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

      const { id } = newUser;

      generateSession(res, id);

      res.status(204).send();
      return;
    case "google":
    case "github":
      break;
  }
};
