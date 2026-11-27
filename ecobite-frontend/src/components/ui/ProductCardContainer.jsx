import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProductos } from "../../services/surplusService";
import "./ProductCardContainer.css";

function ProductCardContainer({ onSelectProduct, onAddToCart, minCards = 0, params = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await getProductos(params);
        if (!isMounted) return;

        // Aseguramos obtener la lista devuelta por la API
        const list = Array.isArray(data) ? data : (data?.data || []);
        setProducts(list);
      } catch (error) {
        console.error("Error al obtener los productos desde la API:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lógica de cards:
  // Si se define un minCards > 0 (ej. destacados o previews), garantiza al menos esa cantidad usando defaults
  // Si minCards es 0 (ej. listados, catálogo o búsquedas), solo renderiza los productos devueltos
  const totalCardsToRender = Math.max(products.length, minCards);
  const cards = [];

  for (let i = 0; i < totalCardsToRender; i++) {
    const productData = products[i]; // Datos de la API o undefined si es de relleno

    cards.push(
      <ProductCard
        key={productData?.id || `fallback-product-${i}`}
        product={productData}
        onSelect={onSelectProduct}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <section className="product-card-container">
      {loading ? (
        <div className="product-card-container__state">
          Cargando productos...
        </div>
      ) : cards.length === 0 ? (
        <div className="product-card-container__state">
          No se encontraron productos disponibles.
        </div>
      ) : (
        <div className="product-card-container__grid">
          {cards}
        </div>
      )}
    </section>
  );
}

export default ProductCardContainer;
