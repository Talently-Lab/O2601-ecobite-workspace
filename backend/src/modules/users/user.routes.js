import { Router } from "express";
import { createUser } from "./user.controller.js";
import { registerSchema } from "./user.schema.js";
import { validateSchema } from "../../middlewares/validateData.js";
import { login, getMe } from "./user.controller.js";
import { loginSchema } from "./user.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import ResponseHelper from "../../utils/responseHelper.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { getClients } from "./user.controller.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), createUser);

router.post("/login", validateSchema(loginSchema), login);

router.get("/me", authenticate, getMe,
  (req, res) => {
    return ResponseHelper.success(
      res,
      req.user,
      "Usuario autenticado"
    );
  }
);

router.get("/", authenticate, authorize("ADMIN"), getClients);



export default router;
