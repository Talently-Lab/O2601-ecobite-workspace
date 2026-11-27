import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Interceptor: inyecta el JWT en cada request ──────────────────────────────
// Lee el token directamente desde localStorage para evitar depender del ciclo
// de vida de React (el interceptor vive fuera del árbol de componentes).
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth-storage");
      const parsed = raw ? JSON.parse(raw) : null;
      const token = parsed?.state?.token ?? null;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Si falla el parseo no bloqueamos la request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;