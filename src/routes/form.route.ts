import { Router } from "express";
import { addForm, getMyForms } from "../controllers/form.controller";

const router = Router();

router.post("/add-form", addForm);
router.get("/my-forms", getMyForms);

export default router;
