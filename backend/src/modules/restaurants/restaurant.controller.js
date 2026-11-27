import { getRestaurants } from "./restaurant.service.js";
import ResponseHelper from "../../utils/responseHelper.js";

export const listRestaurants = async (req, res) => {
  try {
    const restaurants = await getRestaurants();

    return ResponseHelper.success(
      res,
      restaurants,
      "Restaurantes obtenidos correctamente"
    );

  } catch (error) {
    return ResponseHelper.error(
      res,
      "Error al obtener restaurantes",
      error
    );
  }
};

