/**
 * Creates a fresh JSONBin containing `{ "messages": [] }` and stores its
 * id as `JSONBIN_BIN_ID` inside `.env`.
 *
 * Usage:  npm run jsonbin:init
 * Requires `JSONBIN_ACCESS_KEY` in `.env` or in the environment.
 */
import fs from "node:fs";
import { loadEnv, envFilePath } from "../server/env.js";

loadEnv();

const accessKey = process.env.JSONBIN_ACCESS_KEY;
const apiBase = process.env.JSONBIN_API_BASE || "https://api.jsonbin.io/v3";

if (!accessKey) {
  console.error("✗ JSONBIN_ACCESS_KEY not found.");
  console.error("  Copy .env.example to .env and add your JSONBin access key first.");
  process.exit(1);
}

if (process.env.JSONBIN_BIN_ID) {
  console.log("✓ JSONBIN_BIN_ID is already configured:", process.env.JSONBIN_BIN_ID);
  console.log("  Edit .env if you want to point at a different bin.");
  process.exit(0);
}

console.log("Creating a new JSONBin …");

try {
  const response = await fetch(`${apiBase}/b`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": accessKey,
    },
    body: JSON.stringify({ messages: [] }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error(`✗ JSONBin responded with ${response.status}:`, data?.message ?? "");
    if (response.status === 401 || response.status === 403) {
      console.error("  Check that JSONBIN_ACCESS_KEY is correct.");
    }
    process.exit(1);
  }

  const binId = data?.metadata?.id;
  if (!binId) {
    console.error("✗ Could not read the bin id from the JSONBin response.");
    process.exit(1);
  }

  const line = `JSONBIN_BIN_ID=${binId}`;
  let lines = [];
  if (fs.existsSync(envFilePath)) {
    lines = fs.readFileSync(envFilePath, "utf8").split(/\r?\n/);
  } else {
    lines = ["JSONBIN_ACCESS_KEY=" + accessKey];
  }

  const kept = lines.filter((existing) => !existing.trim().startsWith("JSONBIN_BIN_ID="));
  const trailing = kept.length && kept[kept.length - 1] !== "" ? [""] : [];
  const next = [...kept, ...trailing, line, ""];

  fs.writeFileSync(envFilePath, next.join("\n"), "utf8");

  console.log("✓ Bin created:", binId);
  console.log(`✓ Saved to ${envFilePath}`);
  console.log("  Restart the server to pick up the new configuration.");
} catch (error) {
  console.error("✗ Could not reach JSONBin:", error?.message ?? error);
  console.error("  Check your network connection and try again.");
  process.exit(1);
}
