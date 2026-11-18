import { registerUser } from "./user.service.js";
import ResponseHelper from "../../utils/responseHelper.js";
import { loginSchema } from "./user.schema.js";

export const createUser = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return ResponseHelper.created(
      res,
      user,
      "Usuario registrado correctamente"
    );

  } catch (error) {

    // Email duplicado
    if (error.statusCode === 409 || error.code === "P2002") {
      return ResponseHelper.conflict(
        res,
        "El email ya está registrado"
      );
    }

    return ResponseHelper.error(
      res,
      "Error al registrar usuario",
      error
    );
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    return ResponseHelper.success(
      res,
      result,
      "Inicio de sesión exitoso"
    );
  } catch (error) {
    if (error.statusCode === 401) {
      return ResponseHelper.unauthorized(
        res,
        "Credenciales inválidas"
      );
    }

    return ResponseHelper.error(
      res,
      "Error al iniciar sesión",
      error
    );
  }
};