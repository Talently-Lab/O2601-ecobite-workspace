import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

import { useCartStore } from "../../../stores/cartStore";
import { showCart } from "../../../stores/uiStore";

function Navbar({ location = "Av. Cabildo 1500, CABA" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const uniqueItemCount = useCartStore(state => state.items.length);


  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleLoginClick = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Botón hamburguesa*/}
      <button
        type="button"
        className="navbar__hamburger-btn"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
      </button>

      {/* -------------------------------------------------------------
          navbar horizontal
          -------------------------------------------------------------- */}
      <div className="navbar__elements">
        <div className="navbar__search-bar">
          <i className="fa-solid fa-magnifying-glass navbar__search-icon"></i>
          <input
            type="text"
            className="navbar__search-input"
            placeholder="Buscar excedentes, restaurantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.length > 0 && (
            <button
              type="button"
              className="navbar__search-clear-btn"
              onClick={handleClearSearch}
              aria-label="Limpiar búsqueda"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* elemento: ubicación */}
        <div className="navbar__location" title={location}>
          <i className="fa-solid fa-location-dot navbar__location-icon"></i>
          <span className="navbar__location-text">{location}</span>
        </div>

        {/* Botón de Carrito Desktop */}
        <button
          type="button"
          className="navbar__cart-btn"
          onClick={showCart}
          aria-label={`Ver carrito (${uniqueItemCount})`}
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="navbar__cart-count">{uniqueItemCount}</span>
        </button>

        {/* Botón de Login Desktop */}
        <button 
          type="button" 
          className="navbar__login-btn"
          onClick={handleLoginClick}
        >
          <i className="fa-solid fa-user-check"></i>
          <span>Login</span>
        </button>
      </div>

      {/* -------------------------------------------------------------
          Menú flotante desplegable. derecha, apilados verticalmente
          -------------------------------------------------------------- */}
      {isOpen && (
        <>
          {/* Backdrop invisible para cerrar al hacer clic afuera (solo existe cuando se despliega menu hamburguesa) */}
          <div className="navbar__backdrop" onClick={closeMenu} />

          <div className="navbar__dropdown">
            <button
              type="button"
              className="navbar__dropdown-item"
              onClick={closeMenu}
            >
              <i className="fa-solid fa-magnifying-glass navbar__dropdown-icon"></i>
              <span className="navbar__dropdown-text">Buscar</span>
            </button>

            <button
              type="button"
              className="navbar__dropdown-item"
              title={location}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-location-dot navbar__dropdown-icon"></i>
              <span className="navbar__dropdown-text">{location}</span>
            </button>
            
            {/* Botón de Carrito Mobile */}
            <button
              type="button"
              className="navbar__dropdown-item"
              onClick={() => { showCart(); closeMenu(); }}
            >
              <i className="fa-solid fa-cart-shopping navbar__dropdown-icon"></i>
              <span className="navbar__dropdown-text">Ver carrito <div className="navbar__cart-count">{uniqueItemCount}</div></span>
            </button>

            {/* Botón de Login Mobile */}
            <button
              type="button"
              className="navbar__dropdown-item"
              onClick={handleLoginClick}
            >
              <i className="fa-solid fa-user-check navbar__dropdown-icon"></i>
              <span className="navbar__dropdown-text">Login</span>
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
