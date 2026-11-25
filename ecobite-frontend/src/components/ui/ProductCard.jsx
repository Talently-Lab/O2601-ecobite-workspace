import React, { useState } from "react";
import "./ProductCard.css";

function ProductCard({ product = {}, onSelect, onAddToCart }) {
  const {
    id,
    idProducto = id,
    imageUrls = [],
    imageUrl = null,
    nombreProducto = product.name || "Nombre del producto",
    precioOriginal = product.originalPrice ?? null,
    precioRescate = product.rescuePrice ?? null,
    porcentajeDescuento = product.discountPercentage ?? null,
    cantidadDisponible = product.quantityAvailable ?? 0,
    nombreRestaurant = product.restaurant?.name || product.restaurantName || "Restaurante",
    kgRescatados = product.weightKg ?? null,
  } = product;

  // Manejo de imágenes (array o string único)
  const resolvedImages = Array.isArray(imageUrls)
    ? imageUrls
    : imageUrls
    ? [imageUrls]
    : imageUrl
    ? [imageUrl]
    : [];
  const primaryImage = resolvedImages.length > 0 ? resolvedImages[0] : null;

  // Stock disponible
  const maxStock = Number(cantidadDisponible) || 0;
  const isAvailable = maxStock > 0;
  const cardStatusClass = isAvailable ? "product-card--available" : "product-card--unavailable";

  // Estado del contador de cantidad (entre 1 y maxStock)
  const [selectedQuantity, setSelectedQuantity] = useState(isAvailable ? 1 : 0);

  const handleDecrease = (e) => {
    e.stopPropagation();
    setSelectedQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    setSelectedQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  const handleQuantityChange = (e) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setSelectedQuantity(1);
    } else {
      const clamped = Math.max(1, Math.min(maxStock, val));
      setSelectedQuantity(clamped);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAvailable && onAddToCart) {
      onAddToCart({
        idProducto,
        product,
        quantity: selectedQuantity,
      });
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(idProducto);
    }
  };

  return (
    <article
      className={`product-card ${cardStatusClass}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
      data-product-id={idProducto}
    >
      {/* 1. Header de la card: Nombre del producto */}
      <header className="product-card__header">
        <h3 className="product-card__name">{nombreProducto}</h3>
      </header>

      {/* 2. Recuadro para foto (con badge si no hay stock) */}
      <div className="product-card__image-container">
        {!isAvailable && (
          <span className="product-card__badge-unavailable">Agotado</span>
        )}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={nombreProducto}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__image-placeholder">
            <span>Foto no disponible</span>
          </div>
        )}
      </div>

      {/* 3. Cuerpo de la card con los atributos */}
      <div className="product-card__body">
        {/* Nombre del Restaurant */}
        <p className="product-card__restaurant">
          <i className=""></i>
          <span>{nombreRestaurant}</span>
        </p>

        {/* Precios: Original tachado y Rescate destacado */}
        <div className="product-card__prices">
          {precioOriginal !== null && (
            <span className="product-card__price-original">
              ${Number(precioOriginal).toLocaleString()}
            </span>
          )}
          {precioRescate !== null && (
            <span className="product-card__price-rescue">
              ${Number(precioRescate).toLocaleString()}
            </span>
          )}
        </div>

        {/* Métricas: Cantidad disponible y Kg rescatados */}
        <div className="product-card__metrics">
          <span className="product-card__metric">
            <i className=""></i>
            {cantidadDisponible} disp.
          </span>
          {kgRescatados !== null && (
            <span className="product-card__metric">
              <i className=""></i>
              {kgRescatados} kg
            </span>
          )}
        </div>
      </div>

      {/* 4. Footer de la card: Selector de cantidad y Botón CTA */}
      <footer className="product-card__footer" onClick={(e) => e.stopPropagation()}>
        <div className="product-card__quantity-control">
          <button
            type="button"
            className="product-card__qty-btn"
            onClick={handleDecrease}
            disabled={!isAvailable || selectedQuantity <= 1}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <input
            type="number"
            className="product-card__qty-input"
            value={selectedQuantity}
            min={1}
            max={maxStock}
            onChange={handleQuantityChange}
            disabled={!isAvailable}
          />
          <button
            type="button"
            className="product-card__qty-btn"
            onClick={handleIncrease}
            disabled={!isAvailable || selectedQuantity >= maxStock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="product-card__add-btn"
          onClick={handleAddToCart}
          disabled={!isAvailable}
        >
          <i className="g"></i>
          <span>Agregar al carrito</span>
        </button>
      </footer>
    </article>
  );
}

export default ProductCard;
