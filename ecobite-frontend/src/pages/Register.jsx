import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Isologotipo from "../components/ui/Isologotipo";
import { registerUser, loginUser } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Estado del formulario controlado por React
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estados de warning independientes para cada campo (lógica de activación pendiente)
  const [warnings, setWarnings] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Validador de alfanumérico con mínimo 8 caracteres (letras y números)
  const isAlphanumericMin8Max72 = (val) => /^[a-zA-Z0-9]{8,72}$/.test(val);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);

    // Limpiar warning de email si el usuario edita el campo
    if (name === "email" && warnings.email) {
      setWarnings((prev) => ({ ...prev, email: false }));
    }

    // Validación de Password: mínimo 8 caracteres alfanuméricos
    if (name === "password") {
      const isValidLength = isAlphanumericMin8Max72(value);

      if (value && !isValidLength) {
        setApiError("Contraseña debe tener entre 8 y 72 caracteres");
        setWarnings((prev) => ({ ...prev, password: true }));
      } else {
        if (apiError === "Contraseña debe tener entre 8 y 72 caracteres") {
          setApiError("");
        }
        setWarnings((prev) => ({ ...prev, password: false }));
      }

      // Si confirmPassword ya tiene valor, revalidamos coincidencia
      if (nextFormData.confirmPassword) {
        if (nextFormData.confirmPassword !== value) {
          if (!value || isValidLength) {
            setApiError("contraseñas no coinciden");
          }
          setWarnings((prev) => ({ ...prev, confirmPassword: true }));
        } else {
          if (apiError === "contraseñas no coinciden") {
            setApiError("");
          }
          setWarnings((prev) => ({ ...prev, confirmPassword: false }));
        }
      }
    }

    // Validación de ConfirmPassword: solo comprueba coincidencia con password
    if (name === "confirmPassword") {
      if (value && value !== nextFormData.password) {
        setApiError("contraseñas no coinciden");
        setWarnings((prev) => ({ ...prev, confirmPassword: true }));
      } else {
        if (apiError === "contraseñas no coinciden") {
          // Si password aún tiene error de formato, restauramos su mensaje
          if (nextFormData.password && !isAlphanumericMin8Max72(nextFormData.password)) {
            setApiError("Contraseña debe tener entre 8 y 72 caracteres");
          } else {
            setApiError("");
          }
        }
        setWarnings((prev) => ({ ...prev, confirmPassword: false }));
      }
    }
  };

  const handleLogoClick = () => {
    // Limpia el formulario y estado
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setWarnings({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
    setApiError("");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      // 1. Registrar usuario
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // 2. Iniciar sesión automáticamente
      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // 3. Guardar usuario y token en Zustand y redirigir
      if (loginResponse?.data) {
        const { user, token } = loginResponse.data;
        setAuth(user, token);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al registrar / iniciar sesión:", error);

      // Si el backend devuelve errores de validación (ej. formato de email), tomamos el mensaje específico
      const validationErrorMsg = error.response?.data?.errors?.[0]?.message;
      const apiMessage = error.response?.data?.message;

      // Se asigna únicamente el mensaje más reciente reemplazando cualquier anterior
      setApiError(
        validationErrorMsg ||
        apiMessage ||
        "Ocurrió un error al intentar registrar el usuario."
      );

      // Si el campo con error fue el email, encendemos su warning
      if (error.response?.data?.errors?.some((e) => e.field === "email")) {
        setWarnings((prev) => ({ ...prev, email: true }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Header propio de Register */}
      <header className="register-header">
        <div
          className="register-header__logo-container"
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

      {/* Body de Register */}
      <main className="register-body">
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Campo: Nombre */}
          <div className="register-form__group">
            <label htmlFor="register-name" className="register-form__label">
              Ingresá tu nombre
            </label>
            <div
              className={`register-input-wrapper ${
                warnings.name ? "register-input-wrapper--warning" : ""
              }`}
            >
              {warnings.name && (
                <span className="register-input-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <input
                id="register-name"
                name="name"
                type="text"
                className="register-input"
                placeholder="Nombre Apellido"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Campo: E-mail */}
          <div className="register-form__group">
            <label htmlFor="register-email" className="register-form__label">
              Escribí tu dirección de email
            </label>
            <div
              className={`register-input-wrapper ${
                warnings.email ? "register-input-wrapper--warning" : ""
              }`}
            >
              {warnings.email && (
                <span className="register-input-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <input
                id="register-email"
                name="email"
                type="email"
                className="register-input"
                placeholder="email@ecobite.eco"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Campo: Contraseña */}
          <div className="register-form__group">
            <label htmlFor="register-password" className="register-form__label">
              Elegí una contraseña segura. (entre 8 y 72 caracteres)
            </label>
            <div
              className={`register-input-wrapper ${
                warnings.password ? "register-input-wrapper--warning" : ""
              }`}
            >
              {warnings.password && (
                <span className="register-input-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <input
                id="register-password"
                name="password"
                type="password"
                className="register-input"
                placeholder="contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className="register-form__group">
            <label
              htmlFor="register-confirmPassword"
              className="register-form__label"
            >
              Volvé a ingresar tu contraseña
            </label>
            <div
              className={`register-input-wrapper ${
                warnings.confirmPassword
                  ? "register-input-wrapper--warning"
                  : ""
              }`}
            >
              {warnings.confirmPassword && (
                <span className="register-input-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <input
                id="register-confirmPassword"
                name="confirmPassword"
                type="password"
                className="register-input"
                placeholder="contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <p
            className={`register-error-message ${
              apiError ? "register-error-message--visible" : ""
            }`}
            aria-live="polite"
          >
            {apiError || "\u00A0"}
          </p>

          {/* Botón de acción */}
          <div className="register-actions">
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "registrando..." : "placeholder"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Register;
