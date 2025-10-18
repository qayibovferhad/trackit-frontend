import { api } from "@/shared/lib/axios";
import type { ProfileUser } from "../types/profile.type";

export const getProfileData = async (username: string): Promise<ProfileUser> => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};