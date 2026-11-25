import Hero from "../components/sections/hero/Hero";
import ProductCardContainer from "../components/ui/ProductCardContainer";
import RestaurantCardContainer from "../components/ui/RestaurantCardContainer";

function Home() {
  const handleSelectRestaurant = (id) => {
    console.log("Restaurant seleccionado ID:", id);
  };

  return (
    <>
      <Hero />
      <h1>Soy el contenido del main</h1>
      <RestaurantCardContainer minCards={3} onSelectRestaurant={handleSelectRestaurant} />
      <ProductCardContainer minCards={0}/>
    </>
  );
}

export default Home;
