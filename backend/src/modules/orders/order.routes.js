import { Router } from "express";

import { create, pickup, } from "./order.controller.js";

import { createOrderSchema, pickupOrderSchema, } from "./order.schema.js";

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

// Confirmar retiro - Solo administrador
router.patch(
  "/:id/pickup",
  authenticate,
  authorize("ADMIN"),
  validateSchema(pickupOrderSchema),
  pickup
);

export default router;