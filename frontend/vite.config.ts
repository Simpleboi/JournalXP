import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared")
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
    proxy: {
      // anything starting with /api goes to your backend
      "/api": {
        target: "http://localhost:3000", // your Express port
        changeOrigin: true,
        secure: false,
      },
      // health passthrough to hit from the frontend
      "/health": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [".."],
    }
  }
});
