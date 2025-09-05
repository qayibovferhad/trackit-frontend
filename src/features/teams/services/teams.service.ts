import { api } from "@/shared/lib/axios";
import type { MembersOption } from "../types";

export const searchUsers = async (
  query: string
): Promise<{ items: MembersOption[] }> => {
  const response = await api.get("/users/search", { params: { q: query } });
  return response.data;
};
