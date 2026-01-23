import { api } from "../lib/axios";
import type { UserStats } from "../types/user.types";

export const getStats = async (
  userId:string
): Promise<UserStats> => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};
