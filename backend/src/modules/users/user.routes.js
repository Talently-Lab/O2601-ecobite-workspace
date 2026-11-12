import { Router } from "express";
import { createUser } from "./user.controller.js";
import { registerSchema } from "./user.schema.js";
import { validateSchema } from "../../middlewares/validateData.js";

const router = Router();

router.post(
  "/register",
  validateSchema(registerSchema),
  createUser
);

export default router;
