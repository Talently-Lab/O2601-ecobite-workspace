import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
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
    </div>
  );
}

export default MainLayout;