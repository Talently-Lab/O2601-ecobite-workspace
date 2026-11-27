import CheckoutCard from "./CheckoutCard";
import "./CheckoutCardContainer.css";

/**
 * CheckoutCardContainer
 * Envuelve la lista de CheckoutCard y renderiza el encabezado de columnas.
 * Recibe el array `items` del cartStore.
 */
function CheckoutCardContainer({ items = [] }) {
  return (
    <div className="checkout-card-container">
      {/* Encabezado de columnas */}
      <div className="checkout-card-container__header">
        <span className="checkout-card-container__col-product">Producto</span>
        <span className="checkout-card-container__col-numbers">Cant. / Precio / Total</span>
      </div>

      {/* Lista de tarjetas */}
      <div className="checkout-card-container__list">
        {items.map((item) => (
          <CheckoutCard key={item.idProducto} item={item} />
        ))}
      </div>
    </div>
  );
}

export default CheckoutCardContainer;
