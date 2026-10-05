const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(?:\+98|0098|98|0)?9\d{9}$/;
const ID_RE = /^[\w.-]{1,64}$/;

export const MESSAGE_STATUSES = ["new", "read", "answered"];

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 120,
  phoneMax: 20,
  messageMin: 5,
  messageMax: 2000,
};

function asTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalizes a phone number for validation: keeps `+`, drops separators. */
export function normalizePhone(value) {
  return asTrimmedString(value).replace(/[\s\-().]/g, "");
}

/**
 * Validates a new message payload coming from the contact form.
 * Returns `{ ok, value, details }` where `details` maps field -> error code.
 */
export function validateCreateInput(body) {
  const source = body && typeof body === "object" ? body : {};
  const details = {};

  const name = asTrimmedString(source.name);
  const email = asTrimmedString(source.email);
  const phone = normalizePhone(source.phone);
  const message = asTrimmedString(source.message);

  if (name.length < LIMITS.nameMin) details.name = "invalid_name";
  else if (name.length > LIMITS.nameMax) details.name = "name_too_long";

  if (email && (email.length > LIMITS.emailMax || !EMAIL_RE.test(email))) {
    details.email = "invalid_email";
  }

  if (phone && !PHONE_RE.test(phone)) details.phone = "invalid_phone";

  // Require at least one way to reach the sender.
  if (!email && !phone) details.phone = "missing_contact";

  if (message.length < LIMITS.messageMin) details.message = "invalid_message";
  else if (message.length > LIMITS.messageMax) details.message = "message_too_long";

  return {
    ok: Object.keys(details).length === 0,
    details,
    value: { name, email, phone, message },
  };
}

/** Validates `{ id }`. */
export function validateId(body, rawId) {
  const id = asTrimmedString(body?.id) || asTrimmedString(rawId);
  return { ok: ID_RE.test(id), id };
}

/** Validates `{ id, status }` for PATCH. */
export function validateStatusUpdate(body) {
  const idCheck = validateId(body);
  const status = asTrimmedString(body?.status);

  return {
    ok: idCheck.ok && MESSAGE_STATUSES.includes(status),
    id: idCheck.id,
    status,
    details: {
      ...(idCheck.ok ? {} : { id: "invalid_id" }),
      ...(MESSAGE_STATUSES.includes(status) ? {} : { status: "invalid_status" }),
    },
  };
}
