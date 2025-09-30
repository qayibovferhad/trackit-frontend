import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Column } from "../types/boards";

export function useDragAndDrop(
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  updateTaskMutation: any
) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex((col) =>
          col.tasks?.some((task) => task.id === active.id)
        );
        const overColumnIndex = prevColumns.findIndex((col) =>
          col.tasks?.some((task) => task.id === over.id)
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1)
          return prevColumns;

        const activeColumn = prevColumns[activeColumnIndex];
        const overColumn = prevColumns[overColumnIndex];
        const activeTaskIndex =
          activeColumn.tasks?.findIndex((task) => task.id === active.id) ?? -1;
        const overTaskIndex =
          overColumn.tasks?.findIndex((task) => task.id === over.id) ?? -1;

        if (activeTaskIndex === -1 || overTaskIndex === -1) return prevColumns;

        const [activeTask] =
          activeColumn.tasks?.splice(activeTaskIndex, 1) ?? [];
        overColumn.tasks?.splice(overTaskIndex, 0, activeTask);

        return [...prevColumns];
      });
    }

    if (isActiveTask && isOverColumn) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex((col) =>
          col.tasks?.some((task) => task.id === active.id)
        );
        const overColumnIndex = prevColumns.findIndex(
          (col) => col.id === over.id
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1)
          return prevColumns;

        const activeColumn = prevColumns[activeColumnIndex];
        const overColumn = prevColumns[overColumnIndex];
        const activeTaskIndex =
          activeColumn.tasks?.findIndex((task) => task.id === active.id) ?? -1;

        if (activeTaskIndex === -1) return prevColumns;

        const [activeTask] =
          activeColumn.tasks?.splice(activeTaskIndex, 1) ?? [];
        if (!overColumn.tasks) overColumn.tasks = [];
        overColumn.tasks.push(activeTask);

        return [...prevColumns];
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
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

  return { sensors, handleDragOver, handleDragEnd };
}
