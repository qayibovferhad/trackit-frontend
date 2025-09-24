import { Plus, MoreHorizontal } from "lucide-react";
import type { Column as ColumnType, TaskType } from "../../types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import TaskCard from "../task/TaskCard";

export default function Column({
  column,
  tasks,
}: {
  column: ColumnType;
  tasks: TaskType[];
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="w-[300px] flex-shrink-0">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`flex flex-col h-full rounded-lg border ${
          isDragging ? "opacity-90 shadow-lg" : "shadow-none"
        } bg-gray-50`}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-gray-200 rounded-t-lg bg-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm"></span>
              <h3 className="text-sm font-semibold text-gray-900">
                {column.title}
              </h3>
              <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {11}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Add task"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Column menu"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 flex-1 overflow-y-auto" style={{ minHeight: 120 }}>
          {tasks && tasks.length > 0 ? (
            tasks.map((t) => <TaskCard key={t.id} task={t} />)
          ) : (
            <div className="text-center text-sm text-gray-400 py-6">
              No tasks yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
