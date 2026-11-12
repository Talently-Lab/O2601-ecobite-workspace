import { registerUser } from "./user.service.js";
import ResponseHelper from "../../utils/responseHelper.js";

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
