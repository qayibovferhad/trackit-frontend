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

  // Only handle SAME-column reordering during drag.
  // Cross-column moves happen in handleDragEnd to prevent
  // unmount/remount of the active item (which causes infinite useSortable loops).
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask || !isOverTask) return;

    setColumns((prevColumns) => {
      const activeColIdx = prevColumns.findIndex((col) =>
        col.tasks?.some((t) => t.id === active.id)
      );
      const overColIdx = prevColumns.findIndex((col) =>
        col.tasks?.some((t) => t.id === over.id)
      );

      if (activeColIdx === -1 || overColIdx === -1) return prevColumns;
      // Skip cross-column moves — handled in dragEnd
      if (activeColIdx !== overColIdx) return prevColumns;

      const activeTaskIdx = prevColumns[activeColIdx].tasks?.findIndex((t) => t.id === active.id) ?? -1;
      const overTaskIdx = prevColumns[overColIdx].tasks?.findIndex((t) => t.id === over.id) ?? -1;

      if (activeTaskIdx === -1 || overTaskIdx === -1) return prevColumns;

      const newTasks = [...(prevColumns[activeColIdx].tasks || [])];
      const [moved] = newTasks.splice(activeTaskIdx, 1);
      newTasks.splice(overTaskIdx, 0, moved);
      return prevColumns.map((col, i) =>
        i === activeColIdx ? { ...col, tasks: newTasks } : col
      );
    });
  }, [setColumns]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;

    const currentColumns = columnsRef.current;
    const originalColumnId = active.data.current?.task?.columnId;

    // Determine target column from the drop target
    let targetColumnId: string | undefined;
    if (over.data.current?.type === "Column") {
      targetColumnId = over.id as string;
    } else if (over.data.current?.type === "Task") {
      targetColumnId = currentColumns.find((col) =>
        col.tasks?.some((t) => t.id === over.id)
      )?.id;
    }
    console.log(targetColumnId,'targetColumnId');
    
    console.log(originalColumnId,'originalColumnId');
    
    if (!targetColumnId || targetColumnId === originalColumnId) return;

    // Move task to new column in state
    setColumns((prevColumns) => {
      const activeColIdx = prevColumns.findIndex((col) =>
        col.tasks?.some((t) => t.id === active.id)
      );
      const targetColIdx = prevColumns.findIndex((col) => col.id === targetColumnId);

      if (activeColIdx === -1 || targetColIdx === -1) return prevColumns;
      if (activeColIdx === targetColIdx) return prevColumns;

      const activeTaskIdx = prevColumns[activeColIdx].tasks?.findIndex((t) => t.id === active.id) ?? -1;
      if (activeTaskIdx === -1) return prevColumns;

      const movedTask = prevColumns[activeColIdx].tasks?.[activeTaskIdx];
      console.log(movedTask,'movedTask');
      
      if (!movedTask) return prevColumns;

      // If dropping onto a task, insert at that position; otherwise append
      let insertIdx: number | undefined;
      if (over.data.current?.type === "Task") {
        insertIdx = prevColumns[targetColIdx].tasks?.findIndex((t) => t.id === over.id) ?? undefined;
      }

      return prevColumns.map((col, i) => {
        if (i === activeColIdx) {
          const newTasks = [...(col.tasks || [])];
          newTasks.splice(activeTaskIdx, 1);
          return { ...col, tasks: newTasks };
        }
        if (i === targetColIdx) {
          const newTasks = [...(col.tasks || [])];
          if (insertIdx !== undefined && insertIdx >= 0) {
            newTasks.splice(insertIdx, 0, movedTask);
          } else {
            newTasks.push(movedTask);
          }
          return { ...col, tasks: newTasks };
        }
        return col;
      });
    });

    updateTaskMutation.mutate({
      taskId: active.id as string,
      data: { columnId: targetColumnId },
    });
  }, [updateTaskMutation, setColumns]);

  return { sensors, handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeTask };
}
