import { useEffect, useState } from "react";
import type { Board, Column } from "../types/boards";
import { useQuery } from "@tanstack/react-query";
import { fetchBoards } from "../services/boards.service";

const SELECTED_BOARD_KEY = "selectedBoardId";

export function useBoardState(teamId: string | undefined) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", teamId],
    queryFn: () => fetchBoards(teamId),
    enabled: !!teamId,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (!boards || boards.length === 0) {
      setSelectedBoard(null);
      setColumns([]);
      return;
    }

    const savedBoardId = localStorage.getItem(SELECTED_BOARD_KEY);
    const savedBoard = savedBoardId
      ? boards.find((b) => b.id === savedBoardId)
      : null;

    if (savedBoard) {
      setSelectedBoard(savedBoard);
      setColumns(savedBoard.columns ?? []);
    } else {
      const first = boards[0];
      setSelectedBoard(first);
      setColumns(first.columns ?? []);
      localStorage.setItem(SELECTED_BOARD_KEY, first.id);
    }
  }, [boards]);

  const handleSelectChange = (board: Board | null) => {
    setSelectedBoard(board);

    if (board) {
      localStorage.setItem(SELECTED_BOARD_KEY, board.id);
      setColumns(board.columns ?? []);
    } else {
      localStorage.removeItem(SELECTED_BOARD_KEY);
      setColumns([]);
    }
  };

  return {
    boards,
    boardsLoading,
    columns,
    setColumns,
    selectedBoard,
    setSelectedBoard,
    handleSelectChange,
  };
}
