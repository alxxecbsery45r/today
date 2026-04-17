import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Fixed: Environment variables ko defaults ke sath set kiya gaya hai
const rawPort = process.env.PORT || "3000";
const basePath = process.env.BASE_PATH || "/";

const port = Number(rawPort);
const apiProxyTarget = process.env.API_PROXY_TARGET || "http://api-server:3000";

// Agar port number sahi nahi hai toh default 3000 use hoga
const finalPort = (Number.isNaN(port) || port <= 0) ? 3000 : port;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      // Force all packages (including react-leaflet) to use the same React instance
      "react": path.resolve(import.meta.dirname, "node_modules/react"),
      "react-dom": path.resolve(import.meta.dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: finalPort,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
          // Ensure request includes necessary headers
          proxyReq.setHeader('x-forwarded-proto', 'https');
        },
        onProxyRes: (proxyRes, req, res) => {
          // Override CORS headers to allow all origins (dev mode)
          proxyRes.headers['access-control-allow-origin'] = '*';
          proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD';
          proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, X-Requested-With, Accept';
          proxyRes.headers['access-control-allow-credentials'] = 'true';
          proxyRes.headers['access-control-max-age'] = '86400';
          // Ensure expose headers are present
          const existingExpose = proxyRes.headers['access-control-expose-headers'];
          proxyRes.headers['access-control-expose-headers'] = existingExpose 
            ? existingExpose + ', X-Total-Count, X-Page-Count'
            : 'X-Total-Count, X-Page-Count';
        },
      },
    },
  },
  preview: {
    port: finalPort,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
