
import prisma from "../config/prisma.js";

export const checkDatabase = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Error de conexión con PostgreSQL:", error);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
};
