import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { createMessagesHandler } from "./server/messages-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serves `/api/messages` from the Vite dev/preview server using the same
 * server-side handler as production (`server/index.js`), so the JSONBin
 * access key never reaches the browser.
 */
function messagesApi(): Plugin {
  return {
    name: "cabinet21:messages-api",
    configureServer(server) {
      const handler = createMessagesHandler();
      server.middlewares.use((req, res, next) => {
        void handler(req, res, next);
      });
    },
    configurePreviewServer(server) {
      const handler = createMessagesHandler();
      server.middlewares.use((req, res, next) => {
        void handler(req, res, next);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), messagesApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
