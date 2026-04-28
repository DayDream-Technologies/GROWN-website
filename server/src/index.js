import crypto from "node:crypto";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config({ path: "../.env" });

const {
  SQUARE_ACCESS_TOKEN,
  SQUARE_ENVIRONMENT = "sandbox",
  SQUARE_LOCATION_ID,
  PORT = "8787",
} = process.env;

if (!SQUARE_ACCESS_TOKEN) {
  throw new Error("Missing SQUARE_ACCESS_TOKEN. Set it in your .env file.");
}

if (!SQUARE_LOCATION_ID) {
  throw new Error("Missing SQUARE_LOCATION_ID. Set it in your .env file.");
}

const squareBaseUrl =
  SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const app = express();
app.use(cors());
app.use(express.json());

async function squareRequest(path, init) {
  const response = await fetch(`${squareBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Square-Version": "2025-10-16",
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      ...(init?.headers ?? {}),
    },
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(json?.errors)
      ? json.errors.map((e) => e.detail ?? e.code).join("; ")
      : response.statusText;
    const err = new Error(`Square request failed: ${details}`);
    err.status = response.status;
    err.payload = json;
    throw err;
  }
  return json;
}

function normalizeCatalog(searchResponse) {
  const objects = Array.isArray(searchResponse?.objects)
    ? searchResponse.objects
    : [];
  const related = Array.isArray(searchResponse?.related_objects)
    ? searchResponse.related_objects
    : [];

  const imageById = new Map();
  for (const obj of [...objects, ...related]) {
    if (obj.type !== "IMAGE") continue;
    imageById.set(obj.id, obj.image_data?.url ?? null);
  }

  const normalized = [];
  for (const obj of objects) {
    if (obj.type !== "ITEM") continue;
    const itemData = obj.item_data ?? {};
    const itemName = itemData.name ?? "Unnamed item";
    const itemDescription = itemData.description ?? "";
    const itemImageIds = itemData.image_ids ?? [];
    const variations = itemData.variations ?? [];

    for (const variation of variations) {
      const variationData = variation.item_variation_data ?? {};
      const money = variationData.price_money ?? {};
      if (typeof money.amount !== "number") continue;
      const imageIds =
        variationData.image_ids?.length > 0 ? variationData.image_ids : itemImageIds;
      const imageUrls = imageIds
        .map((id) => imageById.get(id))
        .filter((url) => typeof url === "string");

      normalized.push({
        id: variation.id,
        itemId: obj.id,
        name:
          variationData.name && variationData.name !== "Regular"
            ? `${itemName} (${variationData.name})`
            : itemName,
        description: itemDescription,
        amountCents: money.amount,
        currency: (money.currency ?? "USD").toLowerCase(),
        imageUrls,
        variationName: variationData.name ?? null,
      });
    }
  }

  return normalized;
}

app.get("/api/catalog", async (_req, res) => {
  try {
    const result = await squareRequest("/v2/catalog/search", {
      method: "POST",
      body: JSON.stringify({
        object_types: ["ITEM"],
        include_related_objects: true,
        archived_state: "ARCHIVED_STATE_NOT_ARCHIVED",
      }),
    });

    res.json({ items: normalizeCatalog(result) });
  } catch (error) {
    console.error("[square] catalog error", error);
    res.status(error.status || 500).json({
      error: "Failed to fetch Square catalog",
      detail: error.message,
    });
  }
});

app.post("/api/checkout", async (req, res) => {
  const lines = Array.isArray(req.body?.lines) ? req.body.lines : [];
  if (lines.length === 0) {
    res.status(400).json({ error: "At least one checkout line is required." });
    return;
  }

  const orderLineItems = [];
  for (const line of lines) {
    const catalogObjectId = String(line?.catalogObjectId ?? "");
    const quantityNum = Number(line?.quantity);
    const quantity = Number.isInteger(quantityNum) ? quantityNum : NaN;
    if (!catalogObjectId || !Number.isInteger(quantity) || quantity < 1) {
      res.status(400).json({ error: "Invalid checkout line payload." });
      return;
    }
    orderLineItems.push({
      catalog_object_id: catalogObjectId,
      quantity: String(quantity),
    });
  }

  try {
    const result = await squareRequest("/v2/online-checkout/payment-links", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: SQUARE_LOCATION_ID,
          line_items: orderLineItems,
        },
      }),
    });

    const checkoutUrl = result?.payment_link?.url;
    if (!checkoutUrl) {
      throw new Error("Square did not return a payment link URL.");
    }

    res.json({ checkoutUrl });
  } catch (error) {
    console.error("[square] checkout error", error);
    res.status(error.status || 500).json({
      error: "Failed to create checkout link",
      detail: error.message,
    });
  }
});

app.listen(Number(PORT), () => {
  console.info(`[square-bff] Listening on http://localhost:${PORT}`);
});
