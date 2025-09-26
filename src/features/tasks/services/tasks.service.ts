import { api } from "@/shared/lib/axios";

export const createTask = async (data: BoardFormData) => {
  const response = await api.post("/boards", data);
  return response.data;
};
