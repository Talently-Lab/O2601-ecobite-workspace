import api from "./api";

export const getRestaurants = async (params = {}) => {
  try {
    const response = await api.get("/restaurants", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los restaurants:", error);
    throw error;
  }
};

/*Usar cuando exista por ID*/
export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el restaurant con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getRestaurants,
  getRestaurantById,
};
