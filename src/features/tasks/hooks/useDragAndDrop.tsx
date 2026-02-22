import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragOverEvent,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Column } from "../types/boards";
import type { TaskType } from "../types/tasks";
import { useCallback, useRef, useState } from "react";

export function useDragAndDrop(
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  updateTaskMutation: any
) {
  // Always up-to-date reference — avoids stale closure in handleDragEnd
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isOverTask) {
      setColumns((prevColumns) => {
        const activeColIdx = prevColumns.findIndex((col) =>
          col.tasks?.some((t) => t.id === active.id)
        );
        const overColIdx = prevColumns.findIndex((col) =>
          col.tasks?.some((t) => t.id === over.id)
        );

        if (activeColIdx === -1 || overColIdx === -1) return prevColumns;

        const activeTaskIdx = prevColumns[activeColIdx].tasks?.findIndex((t) => t.id === active.id) ?? -1;
        const overTaskIdx = prevColumns[overColIdx].tasks?.findIndex((t) => t.id === over.id) ?? -1;

        if (activeTaskIdx === -1 || overTaskIdx === -1) return prevColumns;

        // Same column — reorder
        if (activeColIdx === overColIdx) {
          const newTasks = [...(prevColumns[activeColIdx].tasks || [])];
          const [moved] = newTasks.splice(activeTaskIdx, 1);
          newTasks.splice(overTaskIdx, 0, moved);
          return prevColumns.map((col, i) =>
            i === activeColIdx ? { ...col, tasks: newTasks } : col
          );
        }

        // Different columns
        const activeTask = prevColumns[activeColIdx].tasks?.[activeTaskIdx];
        if (!activeTask) return prevColumns;

        return prevColumns.map((col, i) => {
          if (i === activeColIdx) {
            const newTasks = [...(col.tasks || [])];
            newTasks.splice(activeTaskIdx, 1);
            return { ...col, tasks: newTasks };
          }
          if (i === overColIdx) {
            const newTasks = [...(col.tasks || [])];
            newTasks.splice(overTaskIdx, 0, activeTask);
            return { ...col, tasks: newTasks };
          }
          return col;
        });
      });
    }

    if (isOverColumn) {
      setColumns((prevColumns) => {
        const activeColIdx = prevColumns.findIndex((col) =>
          col.tasks?.some((t) => t.id === active.id)
        );
        const overColIdx = prevColumns.findIndex((col) => col.id === over.id);

        if (activeColIdx === -1 || overColIdx === -1) return prevColumns;
        if (activeColIdx === overColIdx) return prevColumns;

        const activeTaskIdx = prevColumns[activeColIdx].tasks?.findIndex((t) => t.id === active.id) ?? -1;
        if (activeTaskIdx === -1) return prevColumns;

        const activeTask = prevColumns[activeColIdx].tasks?.[activeTaskIdx];
        if (!activeTask) return prevColumns;

        return prevColumns.map((col, i) => {
          if (i === activeColIdx) {
            const newTasks = [...(col.tasks || [])];
            newTasks.splice(activeTaskIdx, 1);
            return { ...col, tasks: newTasks };
          }
          if (i === overColIdx) {
            return { ...col, tasks: [...(col.tasks || []), activeTask] };
          }
          return col;
        });
      });
    }
  }, [setColumns]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;

    // Use ref to get latest columns — avoids stale closure
    const currentColumns = columnsRef.current;
    const newColumnId = currentColumns.find((col) =>
      col.tasks?.some((t) => t.id === active.id)
    )?.id;

    const originalColumnId = active.data.current?.task?.columnId;

    if (newColumnId && originalColumnId !== newColumnId) {
      updateTaskMutation.mutate({
        taskId: active.id as string,
        data: { columnId: newColumnId },
      });
    }
  }, [updateTaskMutation]);

  return { sensors, handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeTask };
}
