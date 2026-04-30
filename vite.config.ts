import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function normalizeViteBase(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const bffProxyTarget =
    env.SQUARE_BFF_PROXY_TARGET?.trim() || "http://127.0.0.1:8787";
  /** Root-relative deploy path. `/` for Amplify/Vercel/Netlify root; `/repo-name/` for GitHub Pages project sites. */
  const base = normalizeViteBase(env.VITE_BASE);

  return {
    plugins: [react()],
    base,
    server: {
      proxy: {
        "/api": {
          target: bffProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
