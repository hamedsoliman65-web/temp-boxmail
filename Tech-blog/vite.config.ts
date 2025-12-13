import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(({ mode }) => ({
  // 🔥 مهم جدًا لمسار البلوج
  base: "/blog/",

  // 🔹 جذر تطبيق React
  root: path.resolve(import.meta.dirname, "client"),

  plugins: [
    react(),
    ...(mode !== "production" ? [runtimeErrorOverlay()] : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },

  build: {
    // 🔥 لازم يطلع index.html هنا
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
