import { Plus, MoreHorizontal } from "lucide-react";
import type { Column as ColumnType } from "../../types/boards";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import TaskCard from "../task/TaskCard";
import { colorOptions } from "@/shared/constants/colors";
import type { TaskType } from "../../types/tasks";

export default function Column({
  column,
  tasks,
  onAddTask,
}: {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (id: string) => void;
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

  const colorOption =
    colorOptions.find((c) => c.name === column.color) || colorOptions[0];

  return (
    <div className="w-[270px] flex-shrink-0">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`flex flex-col h-full rounded-md border ${
          colorOption.border
        } ${isDragging ? "opacity-90 shadow-lg" : "shadow-none"}`}
      >
        <div
          className={`px-3 py-2 border-b ${colorOption.border} rounded-t-lg ${colorOption.bg}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm"></span>
              <h3 className={`text-sm font-semibold ${colorOption.text}`}>
                {column.title}
              </h3>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                  colorOption.name === "gray"
                    ? "bg-gray-200 text-gray-700"
                    : `bg-${colorOption.name}-100 text-${colorOption.name}-700`
                }`}
              >
                {11}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`p-1 rounded hover:${
                  colorOption.name === "gray"
                    ? "bg-gray-200"
                    : `bg-${colorOption.name}-100`
                }`}
                aria-label="Add task"
                onClick={() => onAddTask(column.id)}
              >
                <Plus className={`w-4 h-4 ${colorOption.text}`} />
              </button>
              <button
                type="button"
                className={`p-1 rounded hover:${
                  colorOption.name === "gray"
                    ? "bg-gray-200"
                    : `bg-${colorOption.name}-100`
                }`}
                aria-label="Column menu"
              >
                <MoreHorizontal className={`w-4 h-4 ${colorOption.text}`} />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`p-3 flex-1 overflow-y-auto ${colorOption.bg}`}
          style={{ minHeight: 120 }}
        >
          {tasks && tasks.length > 0 ? (
            tasks.map((t) => <TaskCard key={t.id} task={t} />)
          ) : (
            <div
              className={`text-center text-sm py-6 ${
                colorOption.name === "gray"
                  ? "text-gray-400"
                  : colorOption.text.replace("700", "400")
              }`}
            >
              No tasks yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
