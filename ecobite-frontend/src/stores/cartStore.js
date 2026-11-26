import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper para imprimir un resumen simple del carrito en consola (pruebas)
const logCartToConsole = (items) => {
  console.group("🛒 Estado actual del Carrito");
  if (items.length === 0) {
    console.log("El carrito está vacío.");
  } else {
    console.table(
      items.map((item) => ({
        ID: item.idProducto,
        Producto: item.name || item.nombreProducto || "Sin nombre",
        Cantidad: item.quantity,
        PrecioUnitario: item.rescuePrice ?? item.precioRescate ?? 0,
        Subtotal: (item.rescuePrice ?? item.precioRescate ?? 0) * item.quantity,
      }))
    );
  }
  console.groupEnd();
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Agregar producto o sumar cantidad si ya existe por idProducto
      addItem: ({ idProducto, product = {}, quantity = 1 }) => {
        const currentItems = get().items;
        const maxStock = Number(product.quantityAvailable ?? product.cantidadDisponible ?? 99);
        const existingIndex = currentItems.findIndex(
          (item) => item.idProducto === idProducto
        );

        let updatedItems;

        if (existingIndex !== -1) {
          // Ya existe: agrupamos sumando la cantidad sin exceder el stock disponible
          updatedItems = currentItems.map((item, idx) => {
            if (idx === existingIndex) {
              const newQty = Math.min(maxStock, item.quantity + quantity);
              return { ...item, quantity: newQty };
            }
            return item;
          });
        } else {
          // Nuevo producto en el carrito: guardamos el snapshot completo
          const initialQty = Math.min(maxStock, Math.max(1, quantity));
          updatedItems = [
            ...currentItems,
            {
              ...product,
              idProducto,
              quantity: initialQty,
            },
          ];
        }

        set({ items: updatedItems });
        logCartToConsole(updatedItems);
      },

      // Actualizar cantidad de un producto específico
      updateQuantity: (idProducto, quantity) => {
        const updatedItems = get().items.map((item) => {
          if (item.idProducto === idProducto) {
            const maxStock = Number(item.quantityAvailable ?? item.cantidadDisponible ?? 99);
            const clampedQty = Math.max(1, Math.min(maxStock, quantity));
            return { ...item, quantity: clampedQty };
          }
          return item;
        });

        set({ items: updatedItems });
        logCartToConsole(updatedItems);
      },

      // Eliminar un producto del carrito
      removeItem: (idProducto) => {
        const updatedItems = get().items.filter(
          (item) => item.idProducto !== idProducto
        );
        set({ items: updatedItems });
        logCartToConsole(updatedItems);
      },

      // Vaciar todo el carrito
      clearCart: () => {
        set({ items: [] });
        logCartToConsole([]);
      },
    }),
    {
      name: "cart-storage", // Clave en localStorage
    }
  )
);
