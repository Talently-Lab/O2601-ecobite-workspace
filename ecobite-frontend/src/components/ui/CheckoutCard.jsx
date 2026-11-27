import "./CheckoutCard.css";

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Resuelve la URL de la primera imagen de un producto.
 *   - null / undefined            → null  → muestra "Sin imagen"
 *   - string                      → ese mismo string
 *   - array con al menos 1 elem   → urlImagen[0]
 *   - array vacío                 → null
 */
function resolveFirstImage(urlImagen) {
  if (!urlImagen) return null;
  if (Array.isArray(urlImagen)) return urlImagen.length > 0 ? urlImagen[0] : null;
  return urlImagen;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * CheckoutCard
 * Muestra el resumen de un ítem del carrito en la página de Checkout.
 *
 * Props esperadas (vienen del snapshot guardado en cartStore):
 *   item.nombreProducto  / item.name
 *   item.nombreRestaurant / item.restaurant?.name / item.restaurantName
 *   item.precioRescate   / item.rescuePrice   (precio unitario)
 *   item.quantity
 *   item.urlImagen       / item.imageUrls / item.imageUrl
 */
function CheckoutCard({ item = {} }) {
  const {
    nombreProducto = item.name || "Sin nombre",
    nombreRestaurant =
      item.restaurant?.name || item.restaurantName || "Sin tienda",
    precioRescate = item.rescuePrice ?? 0,
    quantity = 1,
    urlImagen = item.imageUrls ?? item.imageUrl ?? null,
  } = item;

  const firstImage   = resolveFirstImage(urlImagen);
  const unitPrice    = Number(precioRescate);
  const totalPrice   = unitPrice * Number(quantity);

  return (
    <article className="checkout-card">

      {/* Imagen ─────────────────────────────────────────────── */}
      <div className="checkout-card__image-wrap">
        {firstImage ? (
          <img
            src={firstImage}
            alt={nombreProducto}
            className="checkout-card__image"
          />
        ) : (
          <div className="checkout-card__no-image" aria-label="Sin imagen">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info principal (nombre + tienda) ───────────────────── */}
      <div className="checkout-card__info">
        <p className="checkout-card__name" title={nombreProducto}>
          {nombreProducto}
        </p>
        <p className="checkout-card__store" title={nombreRestaurant}>
          {nombreRestaurant}
        </p>
      </div>

      {/* Columna numérica (cantidad + precios) ──────────────── */}
      <div className="checkout-card__numbers">
        <div className="checkout-card__row">
          <span className="checkout-card__label">Cant.</span>
          <span className="checkout-card__value">{quantity}</span>
        </div>
        <div className="checkout-card__row">
          <span className="checkout-card__label">P. unitario</span>
          <span className="checkout-card__value">
            ${unitPrice.toLocaleString("es-CL")}
          </span>
        </div>
        <div className="checkout-card__row checkout-card__row--total">
          <span className="checkout-card__label">Total</span>
          <span className="checkout-card__value checkout-card__value--total">
            ${totalPrice.toLocaleString("es-CL")}
          </span>
        </div>
      </div>

    </article>
  );
}

export default CheckoutCard;
