import { api } from "@/shared/lib/axios";
import type { CreateTaskPayload, TaskType } from "../types/tasks";

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

export const getTask = async ({
  taskId,
}: {
  taskId?: string;
}): Promise<TaskType | null> => {
  if (!taskId) return null;
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};
