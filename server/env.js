import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");

/**
 * Parse a dotenv-style file. No variable interpolation, values may contain `$`.
 * Lines like `# comment` and empty lines are ignored.
 */
function parseEnv(contents) {
  const result = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim().replace(/^export\s+/, "");
    if (!key) continue;

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Load `.env` into `process.env` without overriding real environment
 * variables (real env always wins). Safe to call multiple times; missing
 * file or malformed lines never crash the app.
 */
export function loadEnv() {
  try {
    if (!fs.existsSync(ENV_PATH)) return;

    const parsed = parseEnv(fs.readFileSync(ENV_PATH, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined && value !== "") {
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.warn("[env] Could not load .env file:", error?.message ?? error);
  }
}

export const projectRoot = ROOT;
export const envFilePath = ENV_PATH;
