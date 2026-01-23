import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { UserStats } from "../types/user.types";
import { getStats } from "../services/api.service";


export const userStatsKeys = {
  all: ['userStats'] as const,
  byUser: (userId: string) => [...userStatsKeys.all, userId] as const,
};


export const useUserStatsQuery = (
  userId: string | undefined
): UseQueryResult<UserStats, Error> => {
  return useQuery({
    queryKey: userStatsKeys.byUser(userId!),
    queryFn: () => getStats(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 2,
    refetchOnWindowFocus: true,
  });
};
