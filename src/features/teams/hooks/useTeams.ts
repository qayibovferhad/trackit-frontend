import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchTeams } from "../services/teams.service";
import type { Team } from "../types";

export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters?: any) => [...teamKeys.lists(), filters] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
};

export const useTeamsQuery = (): UseQueryResult<Team[], Error> => {
  return useQuery({
    queryKey: teamKeys.all,
    queryFn: fetchTeams,
    staleTime: 10_000,
    gcTime: 30 * 60_000,
  });
};