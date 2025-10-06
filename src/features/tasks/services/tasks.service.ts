import { api } from "@/shared/lib/axios";
import type {
  CommentType,
  CreateCommentPayload,
  CreateTaskPayload,
  TaskType,
} from "../types/tasks";

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

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);
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

export const getComments = async ({
  taskId,
}: {
  taskId: string | undefined;
}): Promise<CommentType[]> => {
  if (!taskId) return [];

  const response = await api.get(`/comments/${taskId}`);
  return response.data;
};

export const createComment = async (
  data: CreateCommentPayload
): Promise<CommentType> => {
  const response = await api.post("/comments", data);
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};
