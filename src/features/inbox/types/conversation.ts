import type { User } from "@/features/auth/types/auth.type";

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: User;
}

export interface Participant {
  user: User;
  userId: string;
}

export interface Conversation {
  id: string;
  name?: string;
  type: 'DIRECT' | 'GROUP';
  participants: Participant[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}