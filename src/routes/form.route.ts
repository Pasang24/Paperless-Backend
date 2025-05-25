import { Router } from "express";
import { addForm, getMyForms } from "../controllers/form.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/add-form", addForm);
router.get("/my-forms", getMyForms);

export default router;
