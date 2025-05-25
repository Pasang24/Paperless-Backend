import { Router } from "express";
import { getProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/get-profile", getProfile);

export default router;
