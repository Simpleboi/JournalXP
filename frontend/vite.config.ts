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
      "@shared": path.resolve(__dirname, "../shared"),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - separate large, independent libraries
          // Note: @radix-ui is NOT split out — it's tightly coupled with React
          // and must stay in the same chunk to avoid initialization order issues
          if (id.includes('node_modules')) {
            // Lucide icons (check before generic 'react' — path contains "react")
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Chart/visualization libraries ("recharts" contains "react")
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Firebase
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'vendor-firebase';
            }
            // Date libraries
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            // Other vendor libraries
            return 'vendor-other';
          }
        },
      },
    },
    // Increase chunk size warning limit to 1000 KB
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      // anything starting with /api goes to your backend
      "/api": {
        target: process.env.VITE_API_PROD || "http://127.0.0.1:5003/journalxp-4ea0f/us-central1/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // health passthrough to hit from the frontend
      "/health": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [".."],
    },
  },
});
