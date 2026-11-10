import express from "express";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "EcoBite API funcionando",
  });
});

// Health check for database connection
app.use("/health", healthRoutes);

export default app;
