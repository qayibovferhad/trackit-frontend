import type { User } from "@/features/auth/types/auth.type";
import type { Message } from "./messages";

export interface Participant {
  user: User;
  userId: string;
}

export interface Conversation {
  id: string;
  name?: string;
  type: 'DIRECT' | 'GROUP';
  participants: Participant[];
  lastMessage?: Message
  createdAt: string;
  updatedAt: string;
}