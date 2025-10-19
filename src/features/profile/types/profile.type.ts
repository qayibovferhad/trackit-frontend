import type { User } from "@/features/auth/types/auth.type";

export type ProfileUser = User & {
  teams?: {
    id: string;
    name: string;
    users: { id: string }[];
    joined: boolean; 
    requested:boolean
  }[];
};
