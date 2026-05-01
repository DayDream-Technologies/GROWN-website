# Stripe + AWS: manual setup instructions

This guide covers operations outside the repo: Stripe Dashboard, the **product → Stripe Price ID map** in `infra/`, deploying the SAM stack, webhooks, and Amplify env vars for the Vite app.

Secrets (`sk_*`, `whsec_*`) must **never** be committed. Use Stripe Dashboard, AWS SAM parameters, and Amplify environment variables only.

---

## How pricing stays in sync with Stripe

Use this mental model so you do not “manually update prices” when Stripe already owns them.

| Layer | What Stripe stores | What you change in git | When amounts update automatically |
|--------|----------------------|---------------------------|-----------------------------------|
| **Checkout (implemented)** | Dollar amounts live on **Price** objects (`unit_amount`, currency, recurring). Checkout Sessions use **Price IDs** from [`infra/checkout-session/stripe-catalog.json`](../infra/checkout-session/stripe-catalog.json). | Only **mapping**: internal `productId` → `price_…` IDs. | **Yes.** If you edit an **existing** Price in the Stripe Dashboard (same `price_…` ID), the next checkout uses the **new** amount. No redeploy of `stripe-catalog.json` is required for amount-only changes. |
| **Lambda catalog file** | Does **not** store dollar amounts—only **which** `price_…` IDs apply per SKU and purchase mode (`one_time` / `subscription`). | Edit [`stripe-catalog.json`](../infra/checkout-session/stripe-catalog.json) when you **create new Prices** (new IDs), add products, or drop a subscription/one-time mode—so the API points at the correct IDs. | N/A (IDs are stable until you create replacement Prices). |
| **Shop UI (product cards, modal, cart hints)** | Ideally loaded from Stripe via a **prices API** or **build-time sync** so displayed dollar strings track Dashboard changes—see [§2](#2-display-prices-from-stripe). | Until that ships, copy in [`src/data/products.ts`](../src/data/products.ts) can drift; update it when you change display pricing or finish the integration below. | **After** prices integration: yes, from the API/sync path described in §2. |

**Summary:** Checkout charges always follow **Stripe Price objects** for the IDs in `stripe-catalog.json`. You are **not** maintaining parallel dollar amounts in that JSON—only **ID mappings**. Routine price adjustments happen in the Stripe Dashboard on those Prices.

---

## 1. Stripe Dashboard — Products and Prices

1. Open [Stripe Dashboard](https://dashboard.stripe.com/) (use **Test mode** until you are ready for production).

2. For each SKU that should sell online (aligned with [`infra/checkout-session/stripe-catalog.json`](../infra/checkout-session/stripe-catalog.json)):
   - Create a **Product** (display names can match the site; internal keys like `elevated-brew-mushroom` exist only in our map file).
   - Create a **one-time Price** (`type: one_time`) where relevant and note its Price ID (`price_…`).
   - Where subscriptions are offered, create a **recurring Price** (e.g. monthly) and note its Price ID.

3. SKUs not listed in `stripe-catalog.json` (or with blank Price IDs) cannot go through API checkout—they stay inquiry-only (`contactForPricing`), consistent with the site.

4. Copy **Publishable key** (`pk_test_…` / `pk_live_…`) from **Developers → API keys**. Set **`VITE_STRIPE_PUBLISHABLE_KEY`** in Amplify ([§7](#7-amplify-hosting-or-ci--frontend-environment-variables)).

5. Copy **Secret key** (`sk_test_…` / `sk_live_…`) only for Lambda ([§5](#5-deploy-the-aws-sam-stack-infra)). Never put secret keys in `VITE_*` variables.

---

## 2. Display prices from Stripe

**Checkout** already uses Stripe-backed amounts via Price IDs ([introduction](#how-pricing-stays-in-sync-with-stripe)).

For **what shoppers see** on product cards and in the cart **before** checkout, prefer pulling formatted amounts from Stripe so Dashboard edits propagate without editing `$23.99`-style strings in [`src/data/products.ts`](../src/data/products.ts):

| Approach | Behavior |
|----------|-----------|
| **A — Runtime API (recommended)** | Add **`GET /prices`** (or similar) on your AWS API: Lambda uses `STRIPE_SECRET_KEY` to **`prices.retrieve`** (or list) the `price_…` IDs from `stripe-catalog.json`, returns `unit_amount`, `currency`, recurring metadata. The SPA uses **`VITE_CHECKOUT_API_URL`** (same origin as checkout) or a dedicated **`VITE_PRICES_API_URL`** if split. |
| **B — Build-time sync** | CI calls Stripe and emits `prices.json` / generated fields before `npm run build`; deploy refreshes display prices. |

Until one of these exists, treat [`products.ts`](../src/data/products.ts) as **marketing copy** that you align with Stripe when prices change.

**Inquiry-only SKUs:** No Stripe Price fetch; keep contact flows as today.

---

## 3. Map products to Stripe Price IDs (`stripe-catalog.json`)

This file is **not** a price list in dollars—it only binds each internal `productId` to Stripe **`price_…` identifiers**.

1. Edit [`infra/checkout-session/stripe-catalog.json`](../infra/checkout-session/stripe-catalog.json).

2. For each entry:
   - Set **`one_time`** to the one-time Price ID, or omit / `""` if that SKU has no one-time purchase.
   - Set **`subscription`** to the recurring Price ID where applicable; omit or `""` for one-time-only SKUs (e.g. Golden Calm, Lemon Zest).

3. Commit and redeploy the checkout Lambda when **these mappings change** ([§5](#5-deploy-the-aws-sam-stack-infra))—e.g. new product, new Stripe Price objects, or switching test/live Price IDs.

**You do not** redeploy this file solely because you changed **amounts** on existing Prices in the Dashboard—those amounts live on the Price objects in Stripe.

The checkout Lambda **ignores** dollar amounts from the browser and builds line items only from these resolved Price IDs.

---

## 4. Install Lambda dependencies (before SAM build)

The workflow [`.github/workflows/stripe-api.yml`](../.github/workflows/stripe-api.yml) runs `npm ci` in both Lambda folders before `sam build` when you push changes under `infra/` (or run the workflow manually). For a **local** `sam build` / `sam deploy`, run the same commands yourself:

```powershell
cd infra\checkout-session
npm ci
cd ..\webhook
npm ci
```

---

## 5. Deploy the AWS SAM stack (`infra/`)

**Where this runs:** With [`.github/workflows/stripe-api.yml`](../.github/workflows/stripe-api.yml), **`sam build`** / **`sam deploy`** run in **GitHub Actions** when `infra/` changes on `main`, or when you run **Deploy Stripe API (SAM)** manually—not inside Amplify’s frontend build. Use a **local** `sam deploy` only for ad-hoc or debugging.

### Amplify site URL (this project)

Set SAM **`SiteUrl`** and **`AllowedOrigin`** to the browser origin **without a trailing slash**:

| GitHub variable / SAM parameter | Value |
|--------------------------------|-------|
| `SITE_URL` / **SiteUrl** | `https://main.d3ok3c3nh0dsqd.amplifyapp.com` |
| `ALLOWED_ORIGIN` / **AllowedOrigin** | `https://main.d3ok3c3nh0dsqd.amplifyapp.com` |

If the Amplify hostname or custom domain changes, update variables and redeploy.

### GitHub Actions (primary deploy)

Workflow: [`.github/workflows/stripe-api.yml`](../.github/workflows/stripe-api.yml)

The SAM deploy job uses GitHub Environment **`production`**. Put the following under **Settings → Environments → production** (secrets and variables tabs), not only at the repository level—unless you duplicate them at repo level, environment-scoped values win when the workflow targets `production`.

**Secrets:**

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | Deploy access for CloudFormation / Lambda / API Gateway (omit if using OIDC; see below) |
| `AWS_SECRET_ACCESS_KEY` | Pair for the key above |
| `AWS_ROLE_TO_ASSUME` | IAM role ARN for GitHub OIDC (only if variable **`AWS_USE_OIDC`** is `true`) |
| `STRIPE_SECRET_KEY` | Stripe secret → Lambda `STRIPE_SECRET_KEY` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret `whsec_…` |

**Variables:**

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | Same as **SiteUrl** above |
| `ALLOWED_ORIGIN` | Same as **AllowedOrigin** above |
| `AWS_REGION` | Optional; defaults to `us-east-1` if unset |
| `AWS_USE_OIDC` | Optional; set to **`true`** to use OIDC instead of access keys (requires `AWS_ROLE_TO_ASSUME` + IAM OIDC trust for `repo:YOUR_ORG/GROWN-website:ref:refs/heads/main`) |

If **`configure-aws-credentials`** fails with *Could not load credentials from any providers*: you are not supplying credentials—either add **`AWS_ACCESS_KEY_ID`** and **`AWS_SECRET_ACCESS_KEY`** (on the **production** environment), or enable OIDC with **`AWS_USE_OIDC=true`** and **`AWS_ROLE_TO_ASSUME`**. A workflow that passes only `aws-region` / OIDC defaults without **`role-to-assume`** or keys will always fail.

If **`sam deploy`** fails with *Invalid value for '--parameter-overrides': StripeWebhookSecret= is not a valid format*: **`STRIPE_WEBHOOK_SECRET`** (or another parameter) is **empty**—SAM cannot accept `Key=` with no value. Add the missing secret or variable on the **production** environment. After creating the webhook endpoint in Stripe, copy the **Signing secret** (`whsec_…`) into **`STRIPE_WEBHOOK_SECRET`**.

**GitHub Pages** ([`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)): the **build** job uses **`environment: production`** as well. Optional variable **`VITE_BASE`** (e.g. `/GROWN-website/` for project Pages); if unset, the workflow defaults to **`/GROWN-website/`**.

Stack name: **`grown-stripe-api`**. Use output **`HttpApiUrl`** for Amplify **`VITE_CHECKOUT_API_URL`** ([§7](#7-amplify-hosting-or-ci--frontend-environment-variables)).

### After deploy

1. Copy **`HttpApiUrl`** from stack Outputs.
2. Set **`VITE_CHECKOUT_API_URL`** to that value (no trailing slash).

### Optional: local SAM

1. Install [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and AWS credentials with deploy permissions.
2. Complete [§4](#4-install-lambda-dependencies-before-sam-build), then:

```powershell
cd infra
sam build
sam deploy --guided
```

Example overrides (do not commit secrets):

```yaml
parameter_overrides:
  SiteUrl=https://main.d3ok3c3nh0dsqd.amplifyapp.com
  AllowedOrigin=https://main.d3ok3c3nh0dsqd.amplifyapp.com
  StripeSecretKey=sk_test_xxx
  StripeWebhookSecret=whsec_xxx
```

---

## 6. Stripe webhook endpoint

1. URL: `{HttpApiUrl}/webhooks/stripe`  
   Example: `https://abc123.execute-api.us-east-1.amazonaws.com/webhooks/stripe`

2. Stripe → **Developers → Webhooks → Add endpoint**: set URL; subscribe at minimum to `checkout.session.completed`, plus subscription/invoice events if needed.

3. Reveal **Signing secret** (`whsec_…`). Put it in **`StripeWebhookSecret`** / GitHub secret **`STRIPE_WEBHOOK_SECRET`** and redeploy if it rotates.

4. Local testing: [Stripe CLI](https://stripe.com/docs/stripe-cli) `stripe listen --forward-to …`

**Temporary — list Stripe products:** After deploy, the API exposes **`GET {HttpApiUrl}/debug/stripe-products`** (active products and prices). The SPA route **`/stripe-debug`** (not linked in navigation; enter the URL manually) calls that endpoint — remove the Lambda route and page when you no longer need it.

---

## 7. Amplify Hosting (or CI) — frontend environment variables

Set **before** `npm run build`:

| Variable | Description |
|----------|-------------|
| **VITE_BASE** | Router/asset base (`/` on Amplify root; include `/repo/` only if hosted under a path). |
| **VITE_STRIPE_PUBLISHABLE_KEY** | `pk_test_…` / `pk_live_…` |
| **VITE_CHECKOUT_API_URL** | Same as **`HttpApiUrl`** (no trailing slash). |

Optional: **`VITE_PRICES_API_URL`** if you expose **`GET /prices`** on a different base than checkout.

Optional: **`VITE_CONTACT_EMAIL`**.

---

## 8. Smoke testing

1. Use **test** keys; cart must be all one-time **or** all subscription lines.
2. Cart → **Proceed to checkout** → complete Embedded Checkout on `/checkout`.
3. Confirm redirect to `/checkout/return?session_id=…` and Stripe receipt behavior.
4. **Developers → Events**: webhook deliveries succeed (HTTP 200).

---

## 9. Going live

1. Create or promote **live** Products/Prices in Stripe.

2. Point **`stripe-catalog.json`** at **live** `price_…` IDs (test vs live IDs differ). Redeploy the API.

3. Deploy SAM with **live** **`STRIPE_SECRET_KEY`** and production **`SiteUrl`** / **`AllowedOrigin`**.

4. Add a **live** webhook endpoint and **`whsec_…`**.

5. Amplify: **live** **`VITE_STRIPE_PUBLISHABLE_KEY`** and **`VITE_CHECKOUT_API_URL`**; rebuild.

Changing **amounts** on existing live Prices in Stripe updates checkout **without** editing JSON again, as long as those **`price_…` IDs** stay the same.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| CORS errors | **`AllowedOrigin`** equals the site origin exactly. |
| “Product not available” at checkout | Valid **`price_…`** strings in `stripe-catalog.json` for that SKU/mode; Lambda redeployed after mapping edits. |
| Webhook verify failures | **`STRIPE_WEBHOOK_SECRET`** matches the endpoint; raw POST body reaches Lambda unchanged. |
| Return URL 404 | **`SiteUrl`** matches deployed SPA base path. |
| Display price ≠ Checkout | Implement [§2](#2-display-prices-from-stripe); until then, align [`products.ts`](../src/data/products.ts) with Stripe or rely on Checkout as the authoritative total. |

SAM template: [`infra/template.yaml`](../infra/template.yaml).
