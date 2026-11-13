import React from "react";
import "./RestaurantCard.css";

function RestaurantCard({ restaurant = {} }) {
  const {
    name = "Nombre del restaurante",
    address = "Dirección no disponible",
    description = "Sin descripción",
    isActive = false,
    imageUrl = null, // Placeholder para cuando el backend entregue la URL de la imagen
  } = restaurant;

  // Clase o estado dinámico según 'isActive'
  const cardStatusClass = isActive ? "restaurant-card--active" : "restaurant-card--inactive";

  return (
    <article className={`restaurant-card ${cardStatusClass}`}>
      {/* Header de la card, muestra el nombre del restaurant */}
      <header className="restaurant-card__header">
        <h3 className="restaurant-card__name">{name}</h3>
      </header>

      {/* Recuadro para integrar foto del local (con badge flotante si está inactivo) */}
      <div className="restaurant-card__image-container">
        {!isActive && (
          <span className="restaurant-card__badge-inactive">Inactivo / Cerrado</span>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="restaurant-card__image"
          />
        ) : (
          <div className="restaurant-card__image-placeholder">
            <span>Foto no disponible</span>
          </div>
        )}
      </div>

      {/* datos del restaurant*/}
      <div className="restaurant-card__body">
        {/* dirección */}
        <p className="restaurant-card__address">
          <strong>Dirección:</strong> {address}
        </p>

        {/* descripción */}
        <p className="restaurant-card__description">
          {description}
        </p>
      </div>

      {/* Acciones del footer de la card (opcional) deshabilitado si no está activo */}
      <footer className="restaurant-card__footer">
        <button
          type="button"
          className="restaurant-card__action-btn"
          disabled={!isActive}
        >
          {isActive ? "Accion1" : "No disponible"}
        </button>
      </footer>
    </article>
  );
}

export default RestaurantCard;
