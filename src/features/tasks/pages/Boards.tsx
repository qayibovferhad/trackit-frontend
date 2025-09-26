import BoardModal from "../components/board/BoardModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createColumn, fetchBoards } from "../services/boards.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Board, BoardOption, Column } from "../types/boards";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { type SingleValue } from "react-select";
import BoardHeader from "../components/board/BoardHeader";
import BoardColumn from "../components/column/Column";
import AddColumnButton from "../components/column/AddColumnButton";
import type { ColumnFormData } from "../schemas/boards.schema";
import TaskModal from "../components/task/TaskModal";
import type { TaskType } from "../types/tasks";
export const initialTasks: TaskType[] = [
  {
    id: "1",
    title: "Design login page",
    description: "Create a responsive login page with validation",
    date: "2025-09-25",
    priority: "High",
    assignee: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: "2",
    title: "Setup database schema",
    description: "Define tables and relationships for user management",
    date: "2025-09-26",
    priority: "Medium",
    assignee: {
      name: "Bob Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: "3",
    title: "Implement authentication",
    description: "Add JWT authentication for login and register",
    date: "2025-09-27",
    priority: "High",
    assignee: {
      name: "Charlie Brown",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  },
  {
    id: "4",
    title: "Setup CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
    date: "2025-09-28",
    priority: "Low",
    assignee: {
      name: "Diana Prince",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  },
];
export default function Boards() {
  const [openModal, setOpenModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const { id: teamId } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const queryClient = useQueryClient();

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", teamId ?? ""],
    queryFn: () => fetchBoards(teamId),
    enabled: !!teamId,
    staleTime: 10_000,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const options: BoardOption[] = (boards || []).map((b: Board) => ({
    value: b.id,
    label: b.name,
    board: b,
  }));

  useEffect(() => {
    setSelectedBoard(null);
    setColumns([]);
  }, [teamId]);

  useEffect(() => {
    if (!boards || boards.length === 0) {
      setSelectedBoard(null);
      setColumns([]);
      return;
    }

    const selectedStillExists =
      selectedBoard && boards.some((b) => b.id === selectedBoard.id);

    if (!selectedStillExists) {
      const first = boards[0];
      setSelectedBoard(first);
      setColumns(first.columns ?? []);
    }
  }, [boards]);

  const handleSelectChange = (opt: SingleValue<BoardOption>) => {
    const board = opt ? opt.board : null;
    setSelectedBoard(board);
    if (board && board.columns) {
      setColumns(board.columns);
    } else {
      setColumns([]);
    }
  };

  const handleAddColumn = (formData: ColumnFormData) => {
    if (!selectedBoard?.id) return;

    createColumnMutation.mutate({
      boardId: selectedBoard.id,
      data: formData,
    });
  };

  const handleOpenAddTaskModal = (columnId: string) => {
    setActiveColumnId(columnId);
    setOpenTaskModal(true);
  };

  return (
    <>
      <div className="px-6 pb-6">
        <BoardHeader
          onOpenChange={setOpenModal}
          options={options}
          boardsLoading={boardsLoading}
          selectedBoard={selectedBoard}
          onSelectChange={handleSelectChange}
        />
      </div>

      <div className="px-6 pb-10">
        {selectedBoard && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={() => {}}
            onDragOver={() => {}}
            onDragEnd={() => {}}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="flex gap-3 overflow-x-auto pb-4">
              <SortableContext
                items={selectedBoard?.columns?.map((col) => col.id)}
                strategy={horizontalListSortingStrategy}
              >
                {columns?.map((column) => (
                  <BoardColumn
                    key={column.id}
                    column={column}
                    tasks={initialTasks}
                    onAddTask={() => handleOpenAddTaskModal(column.id)}
                  />
                ))}
              </SortableContext>

              <AddColumnButton onAdd={handleAddColumn} />
            </div>
          </DndContext>
        )}
      </div>

      {openModal && (
        <BoardModal
          open={openModal}
          onOpenChange={setOpenModal}
          defaultTeamId={teamId}
        />
      )}

      {openTaskModal && (
        <TaskModal
          open={openTaskModal}
          onOpenChange={(v) => {
            setOpenTaskModal(v);
            if (!v) setActiveColumnId(null);
          }}
          defaultColumnId={activeColumnId}
        />
      )}
    </>
  );
}
