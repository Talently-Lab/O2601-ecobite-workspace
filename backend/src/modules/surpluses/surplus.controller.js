import { getSurpluses } from "./surplus.service.js";
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
