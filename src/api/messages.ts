import { request } from "./client";
import type { ContactMessage, CreateMessageInput, MessageStatus } from "../types/message";

const ENDPOINT = "/api/messages";

function asMessage(value: unknown): ContactMessage | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== "string" || !raw.id) return null;

  const status: MessageStatus =
    raw.status === "read" || raw.status === "answered" ? raw.status : "new";

  return {
    id: raw.id,
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    message: typeof raw.message === "string" ? raw.message : "",
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
    status,
  };
}

function asMessages(value: unknown): ContactMessage[] {
  if (!Array.isArray(value)) return [];
  return value.map(asMessage).filter((item): item is ContactMessage => item !== null);
}

/** GET /api/messages — latest messages from JSONBin. */
export async function fetchMessages(): Promise<ContactMessage[]> {
  const data = await request<{ messages?: unknown }>(ENDPOINT);
  return asMessages(data?.messages);
}

/** POST /api/messages — appends a new message to the bin. */
export async function createMessage(input: CreateMessageInput): Promise<ContactMessage> {
  const data = await request<{ message?: unknown }>(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
  const message = asMessage(data?.message);
  if (!message) throw new Error("Invalid server response");
  return message;
}

/** PATCH /api/messages — changes a message status. */
export async function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<ContactMessage> {
  const data = await request<{ message?: unknown }>(ENDPOINT, {
    method: "PATCH",
    body: JSON.stringify({ id, status }),
  });
  const message = asMessage(data?.message);
  if (!message) throw new Error("Invalid server response");
  return message;
}

/** DELETE /api/messages?id=… — removes a message. */
export async function deleteMessage(id: string): Promise<void> {
  await request(`${ENDPOINT}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}
