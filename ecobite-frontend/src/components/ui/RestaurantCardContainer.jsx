import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { getRestaurants } from "../../services/restaurantService";
import "./RestaurantCardContainer.css";

function RestaurantCardContainer({ onSelectRestaurant, minCards = 0 }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        if (!isMounted) return;

        // Aseguramos obtener la lista devuelta por la API
        const list = Array.isArray(data) ? data : (data?.data || []);
        setRestaurants(list);
      } catch (error) {
        console.error("Error al obtener los restaurants desde la API:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  // LÓGICA DE CARDS:
  // Si se pasa minCards (ej. 3 en Home), garantiza al menos ese número rellenando con defaults.
  // Si minCards es 0 (ej. en búsquedas/filtros), solo renderiza los resultados encontrados.
  const totalCardsToRender = Math.max(restaurants.length, minCards);
  const cards = [];

  for (let i = 0; i < totalCardsToRender; i++) {
    const restaurantData = restaurants[i]; // Datos de la API o undefined si es de relleno

    cards.push(
      <RestaurantCard
        key={restaurantData?.id || `fallback-card-${i}`}
        restaurant={restaurantData} // Si es undefined, RestaurantCard usa automáticamente sus defaults
        onSelect={onSelectRestaurant}
      />
    );
  }

  return (
    <section className="restaurant-card-container">
      {loading ? (
        <div className="restaurant-card-container__state">
          Cargando restaurantes...
        </div>
      ) : cards.length === 0 ? (
        <div className="restaurant-card-container__state">
          No se encontraron restaurantes.
        </div>
      ) : (
        <div className="restaurant-card-container__grid">
          {cards}
        </div>
      )}
    </section>
  );
}

export default RestaurantCardContainer;
