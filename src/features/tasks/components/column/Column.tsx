import { Plus, MoreHorizontal } from "lucide-react";
import type { Column as ColumnType } from "../../types/boards";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import TaskCard from "../task/TaskCard";
import { colorOptions } from "@/shared/constants/colors";
import type { TaskType } from "../../types/tasks";
import { Button } from "@/shared/ui/button";

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
    <div className="flex-1 min-w-0 h-full">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`flex flex-col h-full rounded-xl border-2 ${
          colorOption.border
        } ${isDragging ? "opacity-90 shadow-xl" : "shadow-sm"} bg-white`}
      >
        <div
          className={`px-4 py-3 border-b-2 ${colorOption.border} rounded-t-xl ${colorOption.bg}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-bold ${colorOption.text} whitespace-normal break-words `}
              >
                {column.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  colorOption.name === "gray"
                    ? "bg-gray-100 text-gray-600"
                    : `bg-${colorOption.name}-50 text-${colorOption.name}-600 border border-${colorOption.name}-200`
                }`}
              >
                {tasks?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-lg hover:${
                  colorOption.name === "gray"
                    ? "bg-gray-100"
                    : `bg-${colorOption.name}-50`
                } transition-colors`}
                aria-label="Add task"
                onClick={() => onAddTask(column.id)}
              >
                <Plus className={`w-4 h-4 ${colorOption.text}`} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-lg hover:${
                  colorOption.name === "gray"
                    ? "bg-gray-100"
                    : `bg-${colorOption.name}-50`
                } transition-colors`}
                aria-label="Column menu"
              >
                <MoreHorizontal className={`w-4 h-4 ${colorOption.text}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-2 flex-1 space-y-3 min-h-[200px] overflow-y-auto">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div
                className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
                  colorOption.name === "gray"
                    ? "bg-gray-50"
                    : `bg-${colorOption.name}-50`
                }`}
              >
                <Plus
                  className={`w-6 h-6 ${
                    colorOption.name === "gray"
                      ? "text-gray-300"
                      : colorOption.text.replace("700", "300")
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  colorOption.name === "gray"
                    ? "text-gray-400"
                    : colorOption.text.replace("700", "400")
                }`}
              >
                No tasks yet
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Click + to add your first task
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
