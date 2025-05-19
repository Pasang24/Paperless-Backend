import { Router } from "express";
import {
  emailRegister,
  googleLoginCallback,
  googleLoginRedirect,
} from "../controllers/auth.controller";

const router = Router();

router.post("/email-register", emailRegister);
router.get("/google", googleLoginRedirect);
router.get("/google/callback", googleLoginCallback);

export default router;
