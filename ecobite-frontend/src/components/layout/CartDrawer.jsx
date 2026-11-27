import React from "react";
import { useUiStore } from "../../stores/uiStore";
import { useCartStore } from "../../stores/cartStore";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";
import { shallow } from "zustand/shallow";
import Isologotipo from "../ui/Isologotipo";
import CartCardContainer from "../ui/CartCardContainer";

function CartDrawer() {
  // UI state comes from uiStore (single source of truth)
  const isOpen = useUiStore(state => state.cartDrawerOpen);

  // Subscribe to cart store (stable snapshots)
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const handleClose = () => useUiStore.getState().closeCartDrawer();
  const navigate = useNavigate();
  const handleCheckout = () => {
    // Navigate to checkout; the checkout page will read the cart from the global store.
    navigate('/pago');
    // Optionally close the drawer after navigation.
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="cart-drawer__backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`cart-drawer ${isOpen ? "cart-drawer--open" : "cart-drawer--closed"}`}
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className="cart-drawer__close-btn"
          onClick={handleClose}
          aria-label="Cerrar carrito"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>

        <div className="cart-drawer__header">
          <div className="isologotipo-container">
            <Isologotipo />
          </div>

          <div className="cart-drawer__header__navbar">
            {/* Checkout button */}
            <button
              type="button"
              className="cart-drawer__checkout-btn"
              onClick={handleCheckout}
              aria-label="Ir a checkout"
            >
              <i className="fa-solid fa-credit-card" />
              <span>Checkout</span>
            </button>
            
            <button
              type="button"
              className="cart-drawer__header-close-btn"
              onClick={handleClose}
              aria-label="Cerrar carrito"
            >
              <i className="fa-solid fa-xmark" />
            </button>

          </div>
        </div>

        {/* Body – render only when open */}
        {isOpen && (
          <div className="cart-drawer__body">
            <CartCardContainer
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
