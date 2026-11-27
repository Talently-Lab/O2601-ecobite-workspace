import { useState } from "react";
import { useCartStore } from "../stores/cartStore";
import { createOrders } from "../services/orderService";
import CheckoutCardContainer from "../components/ui/CheckoutCardContainer";
import "./Checkout.css";

function Checkout() {
  const items    = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);

  const grandTotal = items.reduce((acc, item) => {
    const price = Number(item.precioRescate ?? item.rescuePrice ?? 0);
    return acc + price * Number(item.quantity ?? 1);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { fulfilled, rejected } = await createOrders(items);

      if (rejected.length > 0) {
        console.error("Órdenes con error:", rejected);
        // Muestra los mensajes del backend, uno por línea si hay varios
        const messages = [...new Set(rejected.map((r) => r.message))];
        setError(messages.join(" / "));
        // Si TODAS fallaron, no vaciamos el carrito
        if (fulfilled.length === 0) return;
      }

      // Al menos una orden fue exitosa
      console.log("Órdenes creadas:", fulfilled);
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error("Error inesperado al crear órdenes:", err);
      setError("Ocurrió un error inesperado. Por favor intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="checkout-page">
        <div className="checkout-success">
          <p className="checkout-success__icon">✅</p>
          <h2 className="checkout-success__title">¡Pedido confirmado!</h2>
          <p className="checkout-success__msg">
            Tu reserva fue procesada correctamente.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-page__title">Resumen del pedido</h1>

      {items.length === 0 ? (
        <p className="checkout-page__empty">Tu carrito está vacío.</p>
      ) : (
        <form className="checkout-page__form" onSubmit={handleSubmit}>

          {/* Lista de productos */}
          <CheckoutCardContainer items={items} />

          {/* Totalizador */}
          <div className="checkout-summary">
            <span className="checkout-summary__label">Total a pagar</span>
            <span className="checkout-summary__total">
              ${grandTotal.toLocaleString("es-CL")}
            </span>
          </div>

          {/* Error inline */}
          {error && <p className="checkout-error">{error}</p>}

          {/* Botón submit */}
          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Procesando…" : "Confirmar pedido"}
          </button>

        </form>
      )}
    </main>
  );
}

export default Checkout;
