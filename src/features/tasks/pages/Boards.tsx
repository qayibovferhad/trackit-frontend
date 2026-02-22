import BoardModal from "../components/board/BoardModal";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Board, BoardOption, Column } from "../types/boards";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type SingleValue } from "react-select";
import BoardHeader from "../components/board/BoardHeader";
import BoardColumn from "../components/column/Column";
import AddColumnButton from "../components/column/AddColumnButton";
import type { ColumnFormData } from "../schemas/boards.schema";
import TaskModal from "../components/task/TaskModal";
import type { CreateTaskPayload } from "../types/tasks";
import ColumnModal from "../components/column/ColumnModal";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useBoardState } from "../hooks/useBoardState";
import { useColumnMutations } from "../hooks/useColumnMutations";
import { useTaskMutations } from "../hooks/useTaskMutations";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

export default function Boards() {
  const [openModal, setOpenModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const { id: teamId } = useParams<{ id: string }>();
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [openColumnModal, setOpenColumnModal] = useState(false);
  const [deletingColumn, setDeletingColumn] = useState<Column | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const {
    boards,
    boardsLoading,
    columns,
    setColumns,
    selectedBoard,
    setSelectedBoard,
    handleSelectChange,
  } = useBoardState(teamId);

  const { createColumnMutation, updateColumnMutation, deleteColumnMutation } =
    useColumnMutations(setColumns, setSelectedBoard);

  const { createTaskMutation, updateTaskMutation } = useTaskMutations(
    {
      setColumns,
      setSelectedBoard
    }
  );

  const { sensors, handleDragOver, handleDragEnd } = useDragAndDrop(
    columns,
    setColumns,
    updateTaskMutation
  );

  const options: BoardOption[] = useMemo(
    () => (boards || []).map((b: Board) => ({ value: b.id, label: b.name, board: b })),
    [boards]
  );

  const taskIds = useMemo(
    () => columns.flatMap((column) => column.tasks?.map((task) => task.id) || []),
    [columns]
  );

  const handleAddColumn = (formData: ColumnFormData) => {
    if (!selectedBoard?.id) return;

    createColumnMutation.mutate({
      boardId: selectedBoard.id,
      data: formData,
    });
  };

  const handleOpenAddTaskModal = useCallback((columnId: string) => {
    setActiveColumnId(columnId);
    setOpenTaskModal(true);
  }, []);

  const handleAddTask = (taskData: CreateTaskPayload) => {
    if (!activeColumnId) return;

    const payload = {
      ...taskData,
      columnId: activeColumnId,
    };

    createTaskMutation.mutate(payload);
  };

  const handleUpdateColumn = (formData: ColumnFormData) => {
    if (!editingColumn?.id) return;

    updateColumnMutation.mutate({
      boardId: editingColumn.boardId,
      columnId: editingColumn.id,
      data: formData,
    });
  };

  const handleEditColumn = useCallback((column: Column) => {
    setEditingColumn(column);
    setOpenColumnModal(true);
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    setDeletingColumn(column);
    setConfirmDeleteOpen(true);
  }, [columns]);

  const handleConfirmDelete = () => {
    if (!selectedBoard?.id || !deletingColumn?.id) return;

    deleteColumnMutation.mutate({
      boardId: selectedBoard.id,
      columnId: deletingColumn.id,
    });
  };

  const handleConfirmModalOpenChange = (open: boolean) => {
    setConfirmDeleteOpen(open);
    if (!open) {
      setDeletingColumn(null);
    }
  };
  return (
    <>
      <div className="px-6 pb-6">
        <BoardHeader
          onOpenChange={setOpenModal}
          options={options}
          boardsLoading={boardsLoading}
          selectedBoard={selectedBoard}
          onSelectChange={(opt: SingleValue<BoardOption>) =>
            handleSelectChange(opt ? opt.board : null)
          }
        />
      </div>

      <div className="px-6 pb-10">
        {selectedBoard && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
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
                    onAddTask={handleOpenAddTaskModal}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
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

      {openColumnModal && (
        <ColumnModal
          open={openColumnModal}
          onOpenChange={(v) => {
            setOpenColumnModal(v);
            if (!v) setEditingColumn(null);
          }}
          onSubmit={editingColumn ? handleUpdateColumn : handleAddColumn}
          defaultValues={
            editingColumn
              ? {
                title: editingColumn.title,
                color: editingColumn.color,
                type: editingColumn?.type || "CUSTOM"
              }
              : undefined
          }
        />
      )}
      {deletingColumn && (
        <ConfirmModal
          open={confirmDeleteOpen}
          onOpenChange={handleConfirmModalOpenChange}
          title="Delete this column?"
          description={`"${deletingColumn.title}" and all its tasks will be permanently deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteColumnMutation.isPending}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
