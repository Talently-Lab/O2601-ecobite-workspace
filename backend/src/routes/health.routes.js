
import { Router } from "express";
import { checkDatabase } from "../controllers/health.controller.js";

const router = Router();

router.get("/db", checkDatabase);

export default router;
