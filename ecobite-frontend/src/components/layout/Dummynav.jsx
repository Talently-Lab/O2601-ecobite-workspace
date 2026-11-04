
import { Link } from "react-router-dom";

const routes = [
  { label: "Home", path: "/" },
  { label: "Buscar", path: "/buscar" },
  { label: "Tiendas", path: "/tiendas" },
  { label: "Categorías", path: "/categorias" },
  { label: "Productos", path: "/productos" },
  { label: "Carro", path: "/carro" },
  { label: "Pago", path: "/pago" },
  { label: "Confirmación", path: "/confirmacion" },
  { label: "Detalles", path: "/detalles" },
  { label: "Login", path: "/login" },
];

function DummyNav() {
  return (
    <nav>
      {routes.map((route) => (
        <Link key={route.path} to={route.path}>
          <button>
            Ir a {route.label} ({route.path})
          </button>
        </Link>
      ))}
    </nav>
  );
}

export default DummyNav;
