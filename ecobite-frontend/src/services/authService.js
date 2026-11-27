import api from "./api";

/**
 * Registra un nuevo usuario en el sistema.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} Respuesta del backend (e.g. usuario y/o token)
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error en registerUser:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data; 
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
};

export default {
  registerUser, loginUser,
};
