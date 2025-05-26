import { Router } from "express";
import { addResponse } from "../controllers/response.controller";

const router = Router();

router.post("/add-response", addResponse);

export default router;
