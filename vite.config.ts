import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  appType: 'spa', // Enable SPA fallback
  root: 'frontend', // Set the root to the frontend directory
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "frontend", "src"), // Keep the alias pointing to the correct src directory
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});