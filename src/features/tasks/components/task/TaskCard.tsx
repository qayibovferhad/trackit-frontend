import UserAvatar from "@/shared/components/UserAvatar";
import type { TaskType } from "../../types/tasks";
import { truncateText } from "@/shared/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task }: { task: TaskType }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`overflow-x-hidden bg-white rounded-lg border border-gray-200 shadow-sm p-3 mb-3 cursor-grab active:cursor-grabbing select-none ${
        isDragging
          ? "opacity-50 rotate-2 shadow-xl scale-105 border-blue-300 bg-blue-50"
          : "hover:shadow-md hover:border-gray-300"
      } transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 text-violet-600 pointer-events-auto cursor-pointer flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-gray-800 leading-tight break-words line-clamp-2">
            {truncateText(task.title, 50)}
          </h4>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
              {truncateText(task.description, 60)}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar
                name={task.assignee?.username}
                src={task.assignee?.profileImage}
                size="sm"
              />
              {task.assignee?.username && (
                <span className="truncate max-w-[80px] text-[10px]">
                  {task.assignee.username}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.date && (
                <span className="text-[10px] text-gray-400">{task.date}</span>
              )}
              {task.priority && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDragging && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full shadow-lg animate-pulse"></div>
      )}
    </div>
  );
}
