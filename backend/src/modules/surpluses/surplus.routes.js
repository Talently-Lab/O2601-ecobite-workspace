import { Router } from "express";

import {
    listSurpluses,
    create,
} from "./surplus.controller.js";

import { createSurplusSchema } from "./surplus.schema.js";
import { validateSchema } from "../../middlewares/validateData.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const router = Router();

// Listar excedentes
router.get("/", listSurpluses);

// Crear excedente - Solo administrador
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validateSchema(createSurplusSchema),
    create
);

export default router;
