import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { ProductModalProvider } from "../context/ProductModalProvider";
import { StripePricesProvider } from "../context/StripePricesProvider";
import { useProductModal } from "../context/useProductModal";
import { CartDrawer } from "./cart/CartDrawer";
import { ProductDetailModal } from "./shop/ProductDetailModal";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./Layout.css";

function LayoutShell() {
  const { selectedProduct, closeProduct } = useProductModal();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return (
    <>
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
      <ProductDetailModal product={selectedProduct} onClose={closeProduct} />
      <CartDrawer />
    </>
  );
}

export function Layout() {
  return (
    <CartProvider>
      <StripePricesProvider>
        <ProductModalProvider>
          <LayoutShell />
        </ProductModalProvider>
      </StripePricesProvider>
    </CartProvider>
  );
}
