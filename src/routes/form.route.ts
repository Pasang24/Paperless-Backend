import { Router } from "express";
import { addForm, getMyForms, viewForm } from "../controllers/form.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/view-form/:formId", viewForm);

router.use(authMiddleware);

router.post("/add-form", addForm);
router.get("/my-forms", getMyForms);

export default router;
