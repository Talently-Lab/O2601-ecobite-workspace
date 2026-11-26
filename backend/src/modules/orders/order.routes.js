import { Router } from "express";

import { create } from "./order.controller.js";
import { createOrderSchema } from "./order.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validateSchema } from "../../middlewares/validateData.js";

const router = Router();

// Crear reserva - Solo clientes
router.post(
    "/",
    authenticate,
    authorize("CLIENTE"),
    validateSchema(createOrderSchema),
    create
);

export default router;