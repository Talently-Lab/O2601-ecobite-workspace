import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Guardar sesión actual con usuario y token
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      // Limpia la sesión
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Clave en localStorage
    }
  )
);
