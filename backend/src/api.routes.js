import { Router } from "express";

import restaurantRoutes from "./modules/restaurants/restaurant.routes.js";
import userRoutes from "./modules/users/user.routes.js";

const router = Router();

router.use("/restaurants", restaurantRoutes);
router.use("/users", userRoutes);

export default router;
