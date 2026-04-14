import { NavLink } from "react-router-dom";
import { useCart } from "../context/useCart";
import "./Header.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop Fresh Produce" },
  { to: "/partner", label: "Shop Smoothie & Pantry Blends" },
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__logo" end>
          GROWN
        </NavLink>
        <div className="site-header__right">
          <nav className="site-header__nav" aria-label="Main">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `site-header__link${isActive ? " site-header__link--active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="site-header__cart"
            onClick={toggleCart}
            aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            Cart
            {itemCount > 0 ? (
              <span className="site-header__cart-badge" aria-hidden>
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
