import { Router } from "express";
import {
  addForm,
  getMyForms,
  removeForm,
  viewForm,
} from "../controllers/form.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/view-form/:formId", viewForm);

router.use(authMiddleware);

router.post("/add-form", addForm);
router.get("/my-forms", getMyForms);
router.delete("/remove-form", removeForm);

export default router;
