import { Router } from "express";
import { listSurpluses } from "./surplus.controller.js";

const router = Router();

router.get("/", listSurpluses);

export default router;
