import { Router } from "express";
import { listRestaurants } from "./restaurant.controller.js";

const router = Router();

router.get("/", listRestaurants);

export default router;

