import { api } from "@/shared/lib/axios";
import type { Page, Team } from "../types";
import type { AddTeamFormData } from "../schemas/teams.schema";
import type { User } from "@/features/auth/types/auth.type";

export const searchUsers = async (
  query: string,
  fields?: string[]
): Promise<{ items: Partial<User>[] }> => {

  const response = await api.get("/users/search", {
    params: {
      q: query,
      ...(fields && fields.length ? { fields: fields.join(",") } : {})
    }
  });
  return response.data;
};

export const createTeam = async (data: AddTeamFormData) => {
  const response = await api.post("/teams/add", data);
  return response.data;
};

export const updateTeam = async (id: string, payload: AddTeamFormData) => {
  const response = await api.patch(`/teams/${id}`, payload);
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

export async function deleteTeam(teamId: string) {
  await api.delete(`/teams/${teamId}`);
}

export async function fetchEligibleUsersInfinite(
  teamId: string,
  params?: { cursor?: string | null; take?: number }
): Promise<Page> {
  const q = new URLSearchParams();
  if (params?.cursor) q.set("cursor", params.cursor);
  if (params?.take) q.set("take", String(params.take));
  const response = await api.get(
    `/teams/${teamId}/eligible-users?${q.toString()}`
  );
  return response.data;
}

export async function inviteUser(teamId: string, userId: string) {
  const { data } = await api.post(`/teams/${teamId}/invite`, { userId });
  return data;
}

export const fetchMyAdminTeams = async (): Promise<Team[]> => {
  const response = await api.get("/teams/my-admin-teams");
  return response.data;
};

export async function getTeamMembers(
  teamId: string,
  search: string
): Promise<User[]> {
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : "";
  const { data } = await api.get(`/teams/${teamId}/members${searchParam}`);
  return data;
}

export async function joinToTeam(teamId: string) {
  const response = await api.post(`/teams/${teamId}/request-join`);
  return response.data;
}

export const fetchSharedTeams = async (search: string, defaultUserId: string): Promise<Team[]> => {
  const response = await api.get(`/teams/shared`, { params: { q: search, userId: defaultUserId } });
  return response.data;
};


export const fetchMyAdminTeamsForInvite = async (userId: string): Promise<Team[]> => {
  const response = await api.get(`/teams/my-admin-teams-for-invite/${userId}`);
  return response.data;
};

