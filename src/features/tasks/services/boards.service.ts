import { api } from "@/shared/lib/axios";
import type { BoardFormData } from "../schemas/boards.schema";
import type { Board } from "../types";

export const addBoard = async (data: BoardFormData) => {
  const response = await api.post("/boards", data);
  return response.data;
};

export const fetchBoards = async (teamId?: string | null): Promise<Board[]> => {
  const res = await api.get("/boards", { params: teamId ? { teamId } : {} });
  return res.data;
};
