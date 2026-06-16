import { Link } from "react-router-dom";
import { BRAND_FOOTER_LOGO } from "../config/branding";
import { siteImage } from "../lib/images";
import "./Footer.css";

const footerLogoPath =
  import.meta.env.VITE_FOOTER_LOGO?.trim() || BRAND_FOOTER_LOGO;

const nutritionSources = [
  {
    label: "University of Maryland Extension",
    href: "https://agnr.umd.edu/news/mighty-microgreens",
  },
  {
    label: "USDA microgreens study",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3136577",
  },
  {
    label: "American Journal of Clinical Nutrition",
    href: "https://ajcn.nutrition.org/article/S0002-9165(25)00603-3/fulltext",
  },
  {
    label: "Functional ingredient research",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12073738",
  },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <hr className="site-footer__rule" aria-hidden="true" />
          <img
            className="site-footer__logo"
            src={siteImage(footerLogoPath)}
            alt="GROWN Hydroponic Farms"
            width={320}
            height={121}
            loading="lazy"
            decoding="async"
          />
          <p className="site-footer__tagline">
            From seed to shelf, made for everyday life
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/shop?category=fresh-produce">Fresh Produce</Link>
          <Link to="/shop?category=microgreens">Fresh Microgreens</Link>
          <Link to="/shop?category=pantry-blends">Pantry Drink Refresher Powders</Link>
          <Link to="/shop?category=seasoning">Pantry Microgreen Seasonings</Link>
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
        <nav className="site-footer__sources" aria-label="Nutrition sources">
          <p className="site-footer__sources-label">Nutrition sources</p>
          <div className="site-footer__source-links">
            {nutritionSources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.label}
              </a>
            ))}
          </div>
        </nav>
        <p className="site-footer__legal">© GROWN Hydroponic Farms</p>
      </div>
    </footer>
  );
}
