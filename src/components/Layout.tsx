import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { ProductModalProvider } from "../context/ProductModalProvider";
import { SquareCatalogProvider } from "../context/SquareCatalogContext";
import { useProductModal } from "../context/useProductModal";
import { CartDrawer } from "./cart/CartDrawer";
import { ProductDetailModal } from "./shop/ProductDetailModal";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./Layout.css";

function LayoutShell() {
  const { selectedProduct, closeProduct } = useProductModal();

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
      <SquareCatalogProvider>
        <ProductModalProvider>
          <LayoutShell />
        </ProductModalProvider>
      </SquareCatalogProvider>
    </CartProvider>
  );
}
