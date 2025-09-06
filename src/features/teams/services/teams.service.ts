import { api } from "@/shared/lib/axios";
import type { MembersOption } from "../types";
import type { AddTeamFormData } from "../schemas/teams.schema";

export const searchUsers = async (
  query: string
): Promise<{ items: MembersOption[] }> => {
  const response = await api.get("/users/search", { params: { q: query } });
  return response.data;
};

export const createTeam = async (data: AddTeamFormData) => {
  console.log("data33333", data);

  const response = await api.post("/teams/add", data);
  return response.data;
};
