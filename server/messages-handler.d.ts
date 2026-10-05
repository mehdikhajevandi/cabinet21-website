import type { IncomingMessage, ServerResponse } from "node:http";

export declare function createMessagesHandler(): (
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
) => Promise<void> | void;
