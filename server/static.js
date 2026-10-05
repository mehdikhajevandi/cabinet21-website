import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(__dirname, "..", "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function send(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(body);
}

/**
 * Static file server for the Vite build with SPA fallback:
 * unknown extension-less paths (e.g. `/admin/messages`) return `index.html`.
 */
export function createStaticHandler(root = DEFAULT_ROOT) {
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;

  return function serveStatic(req, res) {
    const method = (req.method || "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return send(res, 405, "Method not allowed", { "Content-Type": "text/plain; charset=utf-8" });
    }

    let pathname;
    try {
      pathname = decodeURIComponent((req.url || "/").split("?")[0]);
    } catch {
      return send(res, 400, "Bad request", { "Content-Type": "text/plain; charset=utf-8" });
    }

    let filePath = path.normalize(path.join(root, pathname));
    if (filePath !== root && !filePath.startsWith(rootWithSep)) {
      return send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    }

    let stats = statOrNull(filePath);
    if (stats?.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      stats = statOrNull(filePath);
    }

    if (!stats) {
      const hasExtension = path.extname(pathname) !== "";
      if (hasExtension) {
        return send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      }
      filePath = path.join(root, "index.html");
      stats = statOrNull(filePath);
    }

    if (!stats) {
      return send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";
    const cacheControl =
      extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable";

    try {
      const data = fs.readFileSync(filePath);
      send(res, 200, method === "HEAD" ? undefined : data, {
        "Content-Type": contentType,
        "Content-Length": data.length,
        "Cache-Control": cacheControl,
      });
    } catch {
      send(res, 500, "Internal server error", { "Content-Type": "text/plain; charset=utf-8" });
    }
  };
}

function statOrNull(target) {
  try {
    return fs.statSync(target);
  } catch {
    return null;
  }
}
