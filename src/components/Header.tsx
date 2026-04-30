import { useEffect, useId, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/useCart";
import { SHOP_NAV_CATEGORIES } from "../lib/shopCategory";
import { siteImage } from "../lib/images";
import "./Header.css";

const tailLinks = [
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { itemCount, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const location = useLocation();
  const mobileMenuId = useId();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onWindowResize() {
      if (window.innerWidth > 800) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__brand" end>
          {!logoFailed ? (
            <img
              className="site-header__logo-img"
              src={siteImage("site/header-logo.png")}
              alt=""
              width={44}
              height={44}
              decoding="async"
              onError={() => setLogoFailed(true)}
            />
          ) : null}
          <span className="site-header__logo">GROWN</span>
        </NavLink>
        <div className="site-header__right">
          <nav className="site-header__nav" aria-label="Main">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `site-header__link${isActive ? " site-header__link--active" : ""}`
              }
            >
              Home
            </NavLink>
            {SHOP_NAV_CATEGORIES.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `site-header__link${isActive ? " site-header__link--active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
            {tailLinks.map(({ to, label }) => (
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
            className="site-header__menu-toggle"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
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
      <nav
        id={mobileMenuId}
        className={`site-header__mobile-nav${mobileMenuOpen ? " is-open" : ""}`}
        aria-label="Main mobile"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `site-header__mobile-link${isActive ? " site-header__mobile-link--active" : ""}`
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        {SHOP_NAV_CATEGORIES.map(({ path, label }) => (
          <NavLink
            key={`mobile-${path}`}
            to={path}
            className={({ isActive }) =>
              `site-header__mobile-link${isActive ? " site-header__mobile-link--active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        {tailLinks.map(({ to, label }) => (
          <NavLink
            key={`mobile-${to}`}
            to={to}
            className={({ isActive }) =>
              `site-header__mobile-link${isActive ? " site-header__mobile-link--active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
