import type { User } from "@/features/auth/types/auth.type";
import { api } from "@/shared/lib/axios";

export const getProfileData = async (username: string): Promise<User> => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};