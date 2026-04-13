import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { PurchaseMode } from "../lib/productPricing";
import { CART_STORAGE_KEY, type CartLine } from "./cartTypes";
import type { CheckoutPayload } from "./checkoutPayload";
import { buildStripeLineItemsFromPriceIds } from "../config/stripe";
import { CartContext } from "./cartContextInstance";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
};

type CartAction =
  | {
      type: "ADD";
      payload: Omit<CartLine, "lineKey" | "quantity"> & {
        quantity?: number;
      };
    }
  | { type: "SET_QTY"; lineKey: string; quantity: number }
  | { type: "REMOVE"; lineKey: string }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "HYDRATE"; lines: CartLine[] };

function lineKey(productId: string, mode: PurchaseMode): string {
  return `${productId}::${mode}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = Math.max(1, action.payload.quantity ?? 1);
      const key = lineKey(action.payload.productId, action.payload.purchaseMode);
      const idx = state.lines.findIndex((l) => l.lineKey === key);
      if (idx === -1) {
        const line: CartLine = {
          lineKey: key,
          productId: action.payload.productId,
          purchaseMode: action.payload.purchaseMode,
          quantity: qty,
          unitAmountCents: action.payload.unitAmountCents,
          currency: action.payload.currency,
          productName: action.payload.productName,
        };
        return { ...state, lines: [...state.lines, line] };
      }
      const next = [...state.lines];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + qty,
      };
      return { ...state, lines: next };
    }
    case "SET_QTY": {
      const q = Math.max(0, Math.floor(action.quantity));
      if (q === 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.lineKey !== action.lineKey),
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.lineKey === action.lineKey ? { ...l, quantity: q } : l,
        ),
      };
    }
    case "REMOVE":
      return {
        ...state,
        lines: state.lines.filter((l) => l.lineKey !== action.lineKey),
      };
    case "CLEAR":
      return { ...state, lines: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "HYDRATE":
      return { ...state, lines: action.lines };
    default:
      return state;
  }
}

const initialState: CartState = { lines: [], isOpen: false };

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", lines: parsed as CartLine[] });
        }
      }
    } catch {
      /* ignore */
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines]);

  const itemCount = useMemo(
    () => state.lines.reduce((n, l) => n + l.quantity, 0),
    [state.lines],
  );

  const subtotalCents = useMemo(
    () =>
      state.lines.reduce(
        (sum, l) => sum + l.unitAmountCents * l.quantity,
        0,
      ),
    [state.lines],
  );

  const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE" }), []);

  const addLine = useCallback(
    (args: {
      productId: string;
      purchaseMode: PurchaseMode;
      unitAmountCents: number;
      productName: string;
      quantity?: number;
    }) => {
      dispatch({
        type: "ADD",
        payload: {
          productId: args.productId,
          purchaseMode: args.purchaseMode,
          unitAmountCents: args.unitAmountCents,
          currency: "usd",
          productName: args.productName,
          quantity: args.quantity,
        },
      });
    },
    [],
  );

  const setQuantity = useCallback((lineKey: string, quantity: number) => {
    dispatch({ type: "SET_QTY", lineKey, quantity });
  }, []);

  const removeLine = useCallback((lineKey: string) => {
    dispatch({ type: "REMOVE", lineKey });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const getCheckoutPayload = useCallback((): CheckoutPayload => {
    const lines = state.lines.map((l) => ({
      productId: l.productId,
      purchaseMode: l.purchaseMode,
      quantity: l.quantity,
      unitAmountCents: l.unitAmountCents,
      productName: l.productName,
    }));
    const stripeLineItems = buildStripeLineItemsFromPriceIds(
      state.lines.map((l) => ({
        productId: l.productId,
        mode: l.purchaseMode,
        quantity: l.quantity,
      })),
    );
    return {
      currency: "usd",
      lines,
      subtotalCents,
      stripeLineItems,
    };
  }, [state.lines, subtotalCents]);

  const value = useMemo(
    () => ({
      lines: state.lines,
      itemCount,
      subtotalCents,
      isOpen: state.isOpen,
      openCart,
      closeCart,
      toggleCart,
      addLine,
      setQuantity,
      removeLine,
      clearCart,
      getCheckoutPayload,
    }),
    [
      state.lines,
      state.isOpen,
      itemCount,
      subtotalCents,
      openCart,
      closeCart,
      toggleCart,
      addLine,
      setQuantity,
      removeLine,
      clearCart,
      getCheckoutPayload,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
