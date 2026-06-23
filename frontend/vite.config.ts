import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Group Material UI and Emotion styling libraries
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "vendor-mui";
            }
            // Group React core libraries
            if (id.includes("react")) {
              return "vendor-react";
            }
            // Other vendor dependencies (like socket.io-client, qrcode.react)
            return "vendor";
          }
        },
      },
    },
  },
});
