import { NavLink } from "react-router-dom";
import "./Header.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/partner", label: "Partner" },
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__logo" end>
          GROWN
        </NavLink>
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
      </div>
    </header>
  );
}
