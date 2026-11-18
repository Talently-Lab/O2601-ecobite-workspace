import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Isologotipo from "../components/ui/Isologotipo";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [hasWarning, setHasWarning] = useState(true);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Limpia el formulario y cualquier estado del Login
    setEmail("");
    setHasWarning(false);
    // Redirige a Home
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <label htmlFor="login-email" className="login-form__label">
            introduce tu correo
          </label>

          <div
            className={`login-input-wrapper ${
              hasWarning ? "login-input-wrapper--warning" : ""
            }`}
          >
            {hasWarning && (
              <span className="login-input-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </span>
            )}
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-actions">
            <button type="submit" className="login-button">
              placeholder
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
