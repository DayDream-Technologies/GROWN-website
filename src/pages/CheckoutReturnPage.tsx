import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Section } from "../components/sections/Section";
import { LinkButton } from "../components/LinkButton";
import { useCart } from "../context/useCart";
import "./CheckoutReturnPage.css";

export function CheckoutReturnPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  return (
    <Section bg="warm" className="checkout-return">
      <div className="checkout-return__inner">
        <h1 className="checkout-return__title">Thank you</h1>
        <p className="checkout-return__text">
          {sessionId
            ? "Your payment is being confirmed. You will receive a receipt from Stripe by email."
            : "Your checkout session could not be confirmed. If you completed a payment, check your email for a receipt."}
        </p>
        {sessionId ? (
          <p className="checkout-return__muted" aria-hidden>
            Reference: {sessionId}
          </p>
        ) : null}
        <div className="checkout-return__actions">
          <LinkButton to="/shop" variant="primary">
            Continue shopping
          </LinkButton>
          <Link className="checkout-return__link" to="/contact">
            Questions? Contact us
          </Link>
        </div>
      </div>
    </Section>
  );
}
