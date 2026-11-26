import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import "./MainLayout.css";
import DummyNav from "./Dummynav";

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
        <DummyNav/>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default MainLayout;