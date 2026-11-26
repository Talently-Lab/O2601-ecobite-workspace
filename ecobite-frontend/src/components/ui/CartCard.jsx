import React, { useState } from "react";
import "./CartCard.css";

function CartCard({ item = {}, onUpdateQuantity, onRemove }) {
  const {
    id,
    idProducto = id,
    imageUrls = [],
    imageUrl = null,
    nombreProducto = item.name || "Nombre del producto",
    nombreRestaurant = item.restaurant?.name || item.restaurantName || "Nombre de tienda",
    precioOriginal = item.originalPrice ?? 0,
    precioRescate = item.rescuePrice ?? 0,
    cantidadDisponible = item.quantityAvailable ?? 10,
    quantity = 1,
  } = item;

  // Imagen principal (soporta array o string único)
  const resolvedImages = Array.isArray(imageUrls)
    ? imageUrls
    : imageUrls
    ? [imageUrls]
    : imageUrl
    ? [imageUrl]
    : [];
  const primaryImage = resolvedImages.length > 0 ? resolvedImages[0] : null;

  const maxStock = Number(cantidadDisponible) || 1;
  const isAvailable = maxStock > 0;

  const [selectedQuantity, setSelectedQuantity] = useState(
    Math.max(1, Math.min(maxStock, Number(quantity) || 1))
  );

  const handleDecrease = () => {
    const nextQty = Math.max(1, selectedQuantity - 1);
    setSelectedQuantity(nextQty);
    if (onUpdateQuantity) onUpdateQuantity(idProducto, nextQty);
  };

  const handleIncrease = () => {
    const nextQty = Math.min(maxStock, selectedQuantity + 1);
    setSelectedQuantity(nextQty);
    if (onUpdateQuantity) onUpdateQuantity(idProducto, nextQty);
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    const nextQty = isNaN(val) ? 1 : Math.max(1, Math.min(maxStock, val));
    setSelectedQuantity(nextQty);
    if (onUpdateQuantity) onUpdateQuantity(idProducto, nextQty);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(idProducto);
    }
  };

  // Precio final calculado según la cantidad (o precio unitario)
  const finalPrice = Number(precioRescate) * selectedQuantity;
  const originalTotal = Number(precioOriginal) * selectedQuantity;

  return (
    <article className="cart-card">
      {/* Sección Izquierda: Imagen 80x80 */}
      <div className="cart-card__left">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={nombreProducto}
            className="cart-card__image"
          />
        ) : (
          <div className="cart-card__image-placeholder">
            <i className="fa-regular fa-image"></i>
          </div>
        )}
      </div>

      {/* Sección Central: Nombre producto, Tienda, Precios */}
      <div className="cart-card__center">
        <h4 className="cart-card__name" title={nombreProducto}>
          {nombreProducto}
        </h4>
        <p className="cart-card__store" title={nombreRestaurant}>
          {nombreRestaurant}
        </p>
        <div className="cart-card__prices">
          {originalTotal > 0 && (
            <span className="cart-card__price-original">
              ${originalTotal.toLocaleString()}
            </span>
          )}
          <span className="cart-card__price-final">
            ${finalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Sección Derecha: Selector de cantidad + Botón eliminar */}
      <div className="cart-card__right">
        <div className="cart-card__quantity-control">
          <button
            type="button"
            className="cart-card__qty-btn"
            onClick={handleDecrease}
            disabled={!isAvailable || selectedQuantity <= 1}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <input
            type="number"
            className="cart-card__qty-input"
            value={selectedQuantity}
            min={1}
            max={maxStock}
            onChange={handleQuantityChange}
            disabled={!isAvailable}
          />
          <button
            type="button"
            className="cart-card__qty-btn"
            onClick={handleIncrease}
            disabled={!isAvailable || selectedQuantity >= maxStock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="cart-card__remove-btn"
          onClick={handleRemove}
          aria-label="Eliminar del carrito"
          title="Eliminar"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </article>
  );
}

export default CartCard;
