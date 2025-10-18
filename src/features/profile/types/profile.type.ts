import type { User } from "@/features/auth/types/auth.type";
import type { Team } from "@/features/teams/types";

export type ProfileUser = User & {
  teams?: Team[];
};