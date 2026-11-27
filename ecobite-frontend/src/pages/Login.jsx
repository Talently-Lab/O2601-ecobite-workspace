import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Isologotipo from "../components/ui/Isologotipo";
import { loginUser } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [warnings, setWarnings] = useState({
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpia el warning del campo específico al volver a escribir
    if (warnings[name]) {
      setWarnings((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleLogoClick = () => {
    // Limpia el formulario y cualquier estado del Login
    setFormData({
      email: "",
      password: "",
    });
    setWarnings({
      email: false,
      password: false,
    });
    setApiError("");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response?.data) {
        const { user, token } = response.data;
        setAuth(user, token);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      // Si el backend devuelve errores de validación (400), tomamos el mensaje específico
      const validationErrorMsg = error.response?.data?.errors?.[0]?.message;
      const apiMessage = error.response?.data?.message;

      // Asignar el mensaje más reciente
      setApiError(
        validationErrorMsg ||
        apiMessage ||
        "Ocurrió un error al iniciar sesión."
      );

      // Encender warnings según los campos observados
      const status = error.response?.status;
      if (status === 401) {
        // Credenciales incorrectas: marcamos ambos campos
        setWarnings({ email: true, password: true });
      } else {
        const errors = error.response?.data?.errors || [];
        setWarnings({
          email: errors.some((err) => err.field === "email"),
          password: errors.some((err) => err.field === "password"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header propio del Login */}
      <header className="login-header">
        <div
          className="login-header__logo-container"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleLogoClick();
            }
          }}
        >
          <Isologotipo />
        </div>
      </header>

      {/* Body del Login */}
      <main className="login-body">
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo: Correo */}
          <div className="login-form__group">
            <label htmlFor="login-email" className="login-form__label">
              introduce tu correo
            </label>
            <div
              className={`login-input-wrapper ${
                warnings.email ? "login-input-wrapper--warning" : ""
              }`}
            >
              {warnings.email && (
                <span className="login-input-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <input
                id="login-email"
                name="email"
                type="email"
                className="login-input"
                placeholder="placeholder"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Campo: Contraseña */}
          <div className="login-form__group">
            <label htmlFor="login-password" className="login-form__label">
              contraseña
            </label>
            <div
              className={`login-input-wrapper ${
                warnings.password ? "login-input-wrapper--warning" : ""
              }`}
            >
              {warnings.password && (
                <span className="login-input-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <input
                id="login-password"
                name="password"
                type="password"
                className="login-input"
                placeholder="placeholder"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mensaje de error con espacio reservado fijo */}
          <p
            className={`login-error-message ${
              apiError ? "login-error-message--visible" : ""
            }`}
            aria-live="polite"
          >
            {apiError || "\u00A0"}
          </p>

          <div className="login-actions">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "iniciando sesión..." : "iniciar sesión"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
