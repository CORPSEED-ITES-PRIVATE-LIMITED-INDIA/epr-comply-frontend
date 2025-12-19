import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // port: 3000,
    allowedHosts: ["eprcomply.com", "www.eprcomply.com"],
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/blogs": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/services": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/leadService": {
        target: "http://localhost:9001",
        changeOrigin: true,
        secure: false,
      },
      "/client": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        // No rewrite needed — keeps /client/services/... intact
        // Spring Boot receives exactly: /client/services/...
      },
    },
  },
});
