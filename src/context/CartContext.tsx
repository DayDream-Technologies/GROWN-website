import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  cartLineKey,
  type CartLine,
  type PurchaseKind,
} from "./cartTypes";
import type { CheckoutPayload } from "./checkoutPayload";
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

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = Math.max(1, action.payload.quantity ?? 1);
      const key = cartLineKey(
        action.payload.productId,
        action.payload.purchaseKind,
      );
      const idx = state.lines.findIndex((l) => l.lineKey === key);
      if (idx === -1) {
        const line: CartLine = {
          lineKey: key,
          productId: action.payload.productId,
          purchaseKind: action.payload.purchaseKind,
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

function parseStoredCartLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Partial<CartLine>;
    if (
      typeof o.productId !== "string" ||
      typeof o.productName !== "string" ||
      typeof o.quantity !== "number" ||
      typeof o.unitAmountCents !== "number" ||
      o.currency !== "usd" ||
      (o.purchaseKind !== "one_time" && o.purchaseKind !== "subscription")
    ) {
      continue;
    }
    const purchaseKind = o.purchaseKind;
    out.push({
      lineKey: cartLineKey(o.productId, purchaseKind),
      productId: o.productId,
      purchaseKind,
      quantity: Math.max(0, Math.floor(o.quantity)),
      unitAmountCents: o.unitAmountCents,
      currency: "usd",
      productName: o.productName,
    });
  }
  return out.filter((l) => l.quantity > 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", lines: parseStoredCartLines(parsed) });
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
      purchaseKind: PurchaseKind;
      unitAmountCents: number;
      productName: string;
      quantity?: number;
    }) => {
      dispatch({
        type: "ADD",
        payload: {
          productId: args.productId,
          purchaseKind: args.purchaseKind,
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
    return {
      currency: "usd",
      lines: state.lines.map((l) => ({
        productId: l.productId,
        productName: l.productName,
        quantity: l.quantity,
        unitAmountCents: l.unitAmountCents,
        purchaseKind: l.purchaseKind,
      })),
      subtotalCents,
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
