import React from "react";
import CartCard from "./CartCard";
import "./CartCardContainer.css";

function CartCardContainer({ items = [], onUpdateQuantity, onRemove }) {
  // Si no hay items entregados todavía, mostramos 3 cards por defecto para la prueba visual
  const itemsToRender = items.length > 0 ? items : [{}, {}, {}];

  return (
    <div className="cart-card-container">
      {itemsToRender.map((item, index) => (
        <CartCard
          key={item.idProducto || item.id || `cart-item-${index}`}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CartCardContainer;
