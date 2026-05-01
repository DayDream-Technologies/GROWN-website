import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { PartnerPage } from "./pages/PartnerPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutReturnPage } from "./pages/CheckoutReturnPage";
import { ShopPage } from "./pages/ShopPage";

const basename = import.meta.env.BASE_URL;

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="checkout/return" element={<CheckoutReturnPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
