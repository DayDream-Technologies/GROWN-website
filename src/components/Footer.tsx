import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__wordmark">GROWN</p>
          <p className="site-footer__tagline">
            From seed to shelf, made for everyday life
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/partner">Partner</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
        </nav>
        <nav className="site-footer__social" aria-label="Social media">
          <p className="site-footer__social-label">@grownhydrofarms</p>
          <div className="site-footer__social-links">
            <a
              href="https://www.instagram.com/grownhydrofarms/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@grownhydrofarms"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
          </div>
        </nav>
        <p className="site-footer__legal">
          © GROWN Hydroponic Farms
        </p>
      </div>
    </footer>
  );
}
