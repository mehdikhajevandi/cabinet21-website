export type MessageStatus = "new" | "read" | "answered";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: MessageStatus;
}

export interface CreateMessageInput {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}
