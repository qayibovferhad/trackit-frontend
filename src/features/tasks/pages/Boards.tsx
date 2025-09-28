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
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragEndEvent,
  closestCenter,
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
import { createTask, updateTask } from "../services/tasks.service";
import type { CreateTaskPayload, TaskType } from "../types/tasks";

export default function Boards() {
  const [openModal, setOpenModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const { id: teamId } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

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
        distance: 3,
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

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<CreateTaskPayload>;
    }) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex((col) =>
          col.tasks?.some((task) => task.id === activeId)
        );
        const overColumnIndex = prevColumns.findIndex((col) =>
          col.tasks?.some((task) => task.id === overId)
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1)
          return prevColumns;

        const activeColumn = prevColumns[activeColumnIndex];
        const overColumn = prevColumns[overColumnIndex];

        const activeTaskIndex =
          activeColumn.tasks?.findIndex((task) => task.id === activeId) ?? -1;
        const overTaskIndex =
          overColumn.tasks?.findIndex((task) => task.id === overId) ?? -1;

        if (activeTaskIndex === -1 || overTaskIndex === -1) return prevColumns;

        const [activeTask] =
          activeColumn.tasks?.splice(activeTaskIndex, 1) ?? [];

        if (activeColumnIndex === overColumnIndex) {
          overColumn.tasks?.splice(overTaskIndex, 0, activeTask);
        } else {
          overColumn.tasks?.splice(overTaskIndex, 0, activeTask);
        }

        return [...prevColumns];
      });
    }

    if (isActiveTask && isOverColumn) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex((col) =>
          col.tasks?.some((task) => task.id === activeId)
        );
        const overColumnIndex = prevColumns.findIndex(
          (col) => col.id === overId
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1)
          return prevColumns;

        const activeColumn = prevColumns[activeColumnIndex];
        const overColumn = prevColumns[overColumnIndex];

        const activeTaskIndex =
          activeColumn.tasks?.findIndex((task) => task.id === activeId) ?? -1;

        if (activeTaskIndex === -1) return prevColumns;

        const [activeTask] =
          activeColumn.tasks?.splice(activeTaskIndex, 1) ?? [];

        if (!overColumn.tasks) {
          overColumn.tasks = [];
        }

        overColumn.tasks.push(activeTask);

        return [...prevColumns];
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const isActiveTask = active.data.current?.type === "Task";

    if (isActiveTask) {
      const newColumnId = columns.find((col) =>
        col.tasks?.some((task) => task.id === active.id)
      )?.id;

      if (newColumnId && active.data.current?.task?.columnId !== newColumnId) {
        updateTaskMutation.mutate({
          taskId: active.id as string,
          data: { columnId: newColumnId },
        });
      }
    }
  };

  const taskIds = columns.flatMap(
    (column) => column.tasks?.map((task) => task.id) || []
  );

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
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="flex gap-3 overflow-x-hidden items-stretch pb-4 h-[calc(100vh-7.5rem)]">
              <SortableContext
                items={[
                  ...(selectedBoard?.columns?.map((col) => col.id) || []),
                  ...taskIds,
                ]}
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
