import http from "node:http";
import { loadEnv } from "./env.js";
import { createMessagesHandler } from "./messages-handler.js";
import { createStaticHandler } from "./static.js";

loadEnv();

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const handleMessagesApi = createMessagesHandler();
const serveStatic = createStaticHandler();

const server = http.createServer((req, res) => {
  // API first, static build (with SPA fallback) for everything else.
  void handleMessagesApi(req, res, () => serveStatic(req, res));
});

server.on("error", (error) => {
  if (error?.code === "EADDRINUSE") {
    console.error(`[server] Port ${port} is already in use. Set PORT to another value.`);
  } else {
    console.error("[server] Failed to start:", error);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Cabinet21 server running at http://localhost:${port}`);
  console.log("  • Site        /");
  console.log("  • Admin       /admin/messages");
  console.log("  • Messages API /api/messages");
});
