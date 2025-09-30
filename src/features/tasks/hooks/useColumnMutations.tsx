import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumn,
  updateColumn,
  deleteColumn,
} from "../services/boards.service";
import type { Column, Board } from "../types/boards";
import type { ColumnFormData } from "../schemas/boards.schema";

export function useColumnMutations(
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  setSelectedBoard: React.Dispatch<React.SetStateAction<Board | null>>
) {
  const queryClient = useQueryClient();

  const createColumnMutation = useMutation({
    mutationFn: (variables: { boardId: string; data: ColumnFormData }) =>
      createColumn(variables.boardId, variables.data),
    onSuccess: (newColumn) => {
      setColumns((prev) => [...prev, newColumn]);
      setSelectedBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: [...(prev.columns || []), newColumn],
        };
      });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const updateColumnMutation = useMutation({
    mutationFn: (variables: {
      boardId: string;
      columnId: string;
      data: ColumnFormData;
    }) => updateColumn(variables.boardId, variables.columnId, variables.data),
    onSuccess: (updatedColumn) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === updatedColumn.id
            ? { ...updatedColumn, tasks: col.tasks }
            : col
        )
      );
      setSelectedBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns?.map((col) =>
            col.id === updatedColumn.id
              ? { ...updatedColumn, tasks: col.tasks }
              : col
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (variables: { boardId: string; columnId: string }) =>
      deleteColumn(variables.boardId, variables.columnId),
    onSuccess: (_, variables) => {
      setColumns((prev) => prev.filter((col) => col.id !== variables.columnId));
      setSelectedBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns?.filter((col) => col.id !== variables.columnId),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  return {
    createColumnMutation,
    updateColumnMutation,
    deleteColumnMutation,
  };
}
