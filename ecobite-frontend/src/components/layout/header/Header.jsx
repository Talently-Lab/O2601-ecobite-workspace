import { useNavigate } from "react-router-dom";
import "./Header.css";
import Navbar from "./Navbar";
import Isologotipo from "../../ui/Isologotipo";

function Header() {
  const navigate = useNavigate();

  const handleBrandClick = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div
        className="header__brand"
        onClick={handleBrandClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleBrandClick();
          }
        }}
      >
        <Isologotipo />
      </div>

      <div className="header__nav-wrapper">
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
