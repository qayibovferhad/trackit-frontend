import type { User } from "@/features/auth/types/auth.type";

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
}