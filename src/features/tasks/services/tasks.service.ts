import { api } from "@/shared/lib/axios";
import type { CreateTaskPayload } from "../types/tasks";

export const createTask = async (data: CreateTaskPayload) => {
  const response = await api.post("/tasks", data);
  return response.data;
};
