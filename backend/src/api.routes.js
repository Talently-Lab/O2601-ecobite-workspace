import { Router } from "express";

import restaurantRoutes from "./modules/restaurants/restaurant.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import surplusRoutes from "./modules/surpluses/surplus.routes.js";

const router = Router();

router.use("/restaurants", restaurantRoutes);
router.use("/users", userRoutes);
router.use("/surpluses", surplusRoutes);

export default router;

