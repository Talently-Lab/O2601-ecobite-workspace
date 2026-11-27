import "./Header.css";
import Navbar from "./Navbar";
import Isologotipo from "../../ui/Isologotipo";

function Header() {
  return (
    <header className="header">
      
      <div className="header__brand">
        <Isologotipo />
      </div>

      <div className="header__nav-wrapper">
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
