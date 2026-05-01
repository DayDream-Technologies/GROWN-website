import { isCheckoutConfigured } from "./checkoutEnv";

export function checkoutApiBase(): string {
  const raw = import.meta.env.VITE_CHECKOUT_API_URL;
  return typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";
}

export type CreateCheckoutSessionLine = {
  productId: string;
  quantity: number;
  purchaseKind: "one_time" | "subscription";
};

export type CreateCheckoutSessionResponse = {
  clientSecret: string;
  sessionId: string;
};

export async function createCheckoutSession(body: {
  lines: CreateCheckoutSessionLine[];
  customerEmail?: string;
}): Promise<CreateCheckoutSessionResponse> {
  if (!isCheckoutConfigured()) {
    throw new Error("Checkout is not configured.");
  }
  const base = checkoutApiBase();
  const res = await fetch(`${base}/checkout/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: unknown = await res.json().catch(() => null);
  const errMsg =
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof (data as { error: unknown }).error === "string"
      ? (data as { error: string }).error
      : null;

  if (!res.ok) {
    throw new Error(errMsg ?? `Checkout failed (${res.status})`);
  }

  if (
    !data ||
    typeof data !== "object" ||
    typeof (data as { clientSecret?: unknown }).clientSecret !== "string" ||
    typeof (data as { sessionId?: unknown }).sessionId !== "string"
  ) {
    throw new Error("Invalid response from checkout API.");
  }

  return {
    clientSecret: (data as CreateCheckoutSessionResponse).clientSecret,
    sessionId: (data as CreateCheckoutSessionResponse).sessionId,
  };
}
