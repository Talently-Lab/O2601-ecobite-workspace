import api from "./api";

export const getProductos = async (params = {}) => {
  try {
    const response = await api.get("/surpluses", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

/*Usar cuando exista */
export const getProductoById = async (id) => {
  try {
    const response = await api.get(`/surpluses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getProductos,
  getProductoById,
};
