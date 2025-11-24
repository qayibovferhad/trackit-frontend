import type { User } from "@/features/auth/types/auth.type";

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: User;
}