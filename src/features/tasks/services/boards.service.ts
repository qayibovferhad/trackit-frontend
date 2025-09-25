import { api } from "@/shared/lib/axios";
import type { BoardFormData, ColumnFormData } from "../schemas/boards.schema";
import type { Board, Column } from "../types";

export const addBoard = async (data: BoardFormData) => {
  const response = await api.post("/boards", data);
  return response.data;
};

export const fetchBoards = async (teamId?: string | null): Promise<Board[]> => {
  const res = await api.get("/boards", { params: teamId ? { teamId } : {} });
  return res.data;
};

export const createColumn = async (
  boardId: string,
  column: Partial<Column> | ColumnFormData
): Promise<Column> => {
  const resp = await api.post(`/boards/${boardId}/columns`, column);
  return resp.data as Column;
};
