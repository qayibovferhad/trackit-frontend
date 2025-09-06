import { api } from "@/shared/lib/axios";
import type { MembersOption, Team } from "../types";
import type { AddTeamFormData } from "../schemas/teams.schema";

export const searchUsers = async (
  query: string
): Promise<{ items: MembersOption[] }> => {
  const response = await api.get("/users/search", { params: { q: query } });
  return response.data;
};

export const createTeam = async (data: AddTeamFormData) => {
  const response = await api.post("/teams/add", data);
  return response.data;
};

export const fetchTeams = async (): Promise<Team[]> => {
  const response = await api.get("/teams");
  return response.data;
};

export const fetchMyInvites = async () => {
  const { data } = await api.get("/teams/my-invites");
  return data;
};

export const fetchMyInvitesCount = async () => {
  const { data } = await api.get("/teams/my-invites-count");
  return data;
};
export const acceptInvite = async (token: string) => {
  const { data } = await api.post("/teams/invites/accept", { token });
  return data;
};

export const declineInvite = async (token: string) => {
  const { data } = await api.post("/teams/invites/decline", { token });
  return data;
};
