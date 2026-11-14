import React from "react";
import "./RestaurantCard.css";

function RestaurantCard({ restaurant = {}, onSelect }) {
  const {
    id,
    name = "Nombre del restaurante",
    address = "Dirección no disponible",
    description = "Sin descripción",
    isActive = false,
    imageUrl = null, // Placeholder para cuando el backend entregue la URL de la imagen
  } = restaurant;

  // 'isActive' define la clase de la card
  const cardStatusClass = isActive ? "restaurant-card--active" : "restaurant-card--inactive";

  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <article
      className={`restaurant-card ${cardStatusClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
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
    </article>
  );
}

export default RestaurantCard;
