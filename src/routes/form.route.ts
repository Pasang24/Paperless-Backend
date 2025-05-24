import { Router } from "express";
import { addForm } from "../controllers/form.controller";

const router = Router();

router.post("/add-form", addForm);

export default router;
