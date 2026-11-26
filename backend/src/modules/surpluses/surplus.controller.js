import { getSurpluses, createSurplus } from "./surplus.service.js";
import ResponseHelper from "../../utils/responseHelper.js";

export const listSurpluses = async (req, res) => {
  try {
    const surpluses = await getSurpluses();

    return ResponseHelper.success(
      res,
      surpluses,
      "Excedentes obtenidos correctamente"
    );

  } catch (error) {
    return ResponseHelper.error(
      res,
      "Error al obtener excedentes",
      error
    );
  }
};

// Controlador para crear un excedente
export const create = async (req, res) => {
  try {
    const surplus = await createSurplus(req.body);

    return ResponseHelper.created(
      res,
      surplus,
      "Excedente creado correctamente"
    );

  } catch (error) {

    if (error.statusCode === 404) {
      return ResponseHelper.notFound(
        res,
        error.message
      );
    }

    if (error.statusCode === 400) {
      return ResponseHelper.badRequest(
        res,
        error.message
      );
    }

    return ResponseHelper.error(
      res,
      "Error al crear excedente",
      error
    );
  }
};
