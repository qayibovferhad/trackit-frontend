import { api } from "@/shared/lib/axios";
import type { CreateTaskPayload } from "../types/tasks";

export const createTask = async (data: CreateTaskPayload) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (
  taskId: string,
  data: Partial<CreateTaskPayload>
) => {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data;
};
