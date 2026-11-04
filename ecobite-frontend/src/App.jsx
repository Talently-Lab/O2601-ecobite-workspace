import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Stores from "./pages/Stores";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirm from "./pages/Confirm";
import Details from "./pages/Details";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>

      {/*con header y footer*/}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/tiendas" element={<Stores />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/carro" element={<Cart />} />
          <Route path="/pago" element={<Checkout />} />
          <Route path="/confirmacion" element={<Confirm />} />
          <Route path="/detalles" element={<Details />} />
        </Route>

      {/*sin header ni footer*/}  
      <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;