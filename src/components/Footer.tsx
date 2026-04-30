import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <hr className="site-footer__rule" aria-hidden="true" />
          <p className="site-footer__wordmark">GROWN Hydroponic Farms</p>
          <p className="site-footer__tagline">
            From seed to shelf, made for everyday life
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/shop?category=fresh-produce">Fresh Produce</Link>
          <Link to="/shop?category=microgreens">Fresh Microgreens</Link>
          <Link to="/shop?category=pantry-blends">Pantry Blends</Link>
          <Link to="/shop?category=seasoning">Pantry Seasonings</Link>
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
        <p className="site-footer__legal">© GROWN Hydroponic Farms</p>
      </div>
    </footer>
  );
}
