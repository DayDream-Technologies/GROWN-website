import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const bffProxyTarget =
    env.SQUARE_BFF_PROXY_TARGET?.trim() || "http://127.0.0.1:8787";

  return {
    plugins: [react()],
    base: "/GROWN-website/",
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
