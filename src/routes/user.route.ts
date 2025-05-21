import { Router } from "express";
import { getProfile } from "../controllers/user.controller";

const router = Router();

router.get("/get-profile", getProfile);

export default router;
