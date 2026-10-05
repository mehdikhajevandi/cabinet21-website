/**
 * Minimal JSONBin v3 mock for local development without hitting the real API.
 *
 *   node scripts/mock-jsonbin.mjs           # listens on port 4444
 *   JSONBIN_API_BASE=http://127.0.0.1:4444 npm run dev
 *
 * Supported endpoints:
 *   POST /v3/b                     -> create bin
 *   GET  /v3/b/:id/latest         -> latest record
 *   PUT  /v3/b/:id                -> replace record
 */
import http from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.MOCK_PORT) || 4444;
const bins = new Map();

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(null);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  const parts = url.pathname.split("/").filter(Boolean); // ["v3", "b", ...]

  try {
    // POST /v3/b
    if (req.method === "POST" && parts.join("/") === "v3/b") {
      const body = (await readBody(req)) ?? {};
      const id = randomUUID().replace(/-/g, "").slice(0, 24);
      bins.set(id, { record: body, createdAt: Date.now() });
      console.log(`[mock] created bin ${id}`);
      return json(res, 200, {
        message: "Bin created successfully",
        metadata: { id, private: false, createdAt: new Date().toISOString() },
        record: body,
      });
    }

    // GET /v3/b/:id/latest
    if (req.method === "GET" && parts.length === 4 && parts[0] === "v3" && parts[1] === "b" && parts[3] === "latest") {
      const bin = bins.get(parts[2]);
      if (!bin) return json(res, 404, { message: "Bin not found" });
      return json(res, 200, {
        record: bin.record,
        metadata: { id: parts[2], createdAt: new Date(bin.createdAt).toISOString() },
      });
    }

    // PUT /v3/b/:id
    if (req.method === "PUT" && parts.length === 3 && parts[0] === "v3" && parts[1] === "b") {
      const body = (await readBody(req)) ?? {};
      const existing = bins.get(parts[2]);
      if (!existing) {
        // The real API upserts on PUT — mimic that.
        bins.set(parts[2], { record: body, createdAt: Date.now() });
      } else {
        existing.record = body;
      }
      console.log(`[mock] updated bin ${parts[2]}`);
      return json(res, 200, {
        message: "Record updated",
        metadata: { id: parts[2] },
        record: body,
      });
    }

    return json(res, 404, { message: "Not found" });
  } catch {
    return json(res, 400, { message: "Invalid JSON" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`JSONBin mock listening on http://127.0.0.1:${port}`);
});
