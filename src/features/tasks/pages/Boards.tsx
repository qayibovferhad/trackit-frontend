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
import { createTask } from "../services/tasks.service";
import type { CreateTaskPayload } from "../types/tasks";

export default function Boards() {
  const [openModal, setOpenModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const { id: teamId } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const queryClient = useQueryClient();

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", teamId],
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

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask, variables) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === variables.columnId
            ? { ...col, tasks: [...(col.tasks || []), newTask] }
            : col
        )
      );

      setSelectedBoard((prev) => {
        if (!prev) return prev;
        console.log(newTask);

        return {
          ...prev,
          columns: prev.columns?.map((col) =>
            col.id === variables.columnId
              ? { ...col, tasks: [...(col.tasks || []), newTask] }
              : col
          ),
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
      console.log(first);

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

  const handleAddTask = (taskData: CreateTaskPayload) => {
    if (!activeColumnId) return;

    const payload = {
      ...taskData,
      columnId: activeColumnId,
    };

    createTaskMutation.mutate(payload);
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
            <div className="flex gap-3 overflow-x-hidden pb-4">
              <SortableContext
                items={selectedBoard?.columns?.map((col) => col.id)}
                strategy={horizontalListSortingStrategy}
              >
                {columns?.map((column) => (
                  <BoardColumn
                    key={column.id}
                    column={column}
                    tasks={column.tasks || []}
                    onAddTask={() => handleOpenAddTaskModal(column.id)}
                  />
                ))}
              </SortableContext>

              {columns.length < 5 && (
                <AddColumnButton onAdd={handleAddColumn} />
              )}
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
          onAddTask={handleAddTask}
          teamId={teamId}
        />
      )}
    </>
  );
}
