import { useQuery } from "@tanstack/react-query";
import type { TaskFilter } from "../types/tasks";
import { getAll } from "../services/tasks.service";

export const useTasksQuery = (filter?: TaskFilter) => {
  return useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => getAll(filter),
  });
};