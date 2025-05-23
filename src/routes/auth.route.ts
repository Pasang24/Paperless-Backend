import { Router } from "express";
import {
  emailLogin,
  emailRegister,
  githubLoginCallback,
  githubLoginRedirect,
  googleLoginCallback,
  googleLoginRedirect,
} from "../controllers/auth.controller";

const router = Router();

router.post("/email-login", emailLogin);
router.post("/email-register", emailRegister);
router.get("/google", googleLoginRedirect);
router.get("/google/callback", googleLoginCallback);
router.get("/github", githubLoginRedirect);
router.get("/github/callback", githubLoginCallback);

export default router;
