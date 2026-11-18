import jwt from "jsonwebtoken";
import ResponseHelper from "../utils/responseHelper.js";

export const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return ResponseHelper.unauthorized(
      res,
      "Token requerido"
    );
  }

  const token = authorization.slice(7);

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no configurado");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.name === "NotBeforeError") {
      return ResponseHelper.unauthorized(
        res,
        "Token inválido o expirado"
      );
    }

    return ResponseHelper.error(
      res,
      "Error de autenticación",
      error
    );
  }
};