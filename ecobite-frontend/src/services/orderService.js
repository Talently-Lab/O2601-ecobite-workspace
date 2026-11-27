import api from "./api";

/**
 * Crea una o varias órdenes a partir de los items del carrito.
 *
 * El backend espera un objeto por ítem:
 *   { surplusId: string (UUID), quantity: number }
 *
 * Se realizan las llamadas en paralelo (Promise.allSettled) para no detener
 * el flujo si uno de los ítems falla individualmente.
 *
 * @param {Array} items - Array de items del cartStore
 * @returns {Promise<{ fulfilled: Array, rejected: Array }>}
 */
export const createOrders = async (items = []) => {
  const requests = items.map((item) =>
    api.post("/orders", {
      surplusId: item.idProducto,
      quantity:  Number(item.quantity ?? 1),
    })
  );

  const results = await Promise.allSettled(requests);

  const fulfilled = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => {
      console.log("✅ Respuesta del backend:", r.value.data);
      return r.value.data;
    });

  const rejected = results
    .filter((r) => r.status === "rejected")
    .map((r) => {
      // Extrae el mensaje que el backend envía en response.data.message
      // Estructura esperada: { success: false, message: "El excedente está vencido" }
      const backendMessage = r.reason?.response?.data?.message ?? null;
      return {
        raw:     r.reason,
        message: backendMessage || "Error desconocido al procesar el pedido.",
      };
    });

  return { fulfilled, rejected };
};

export default { createOrders };
