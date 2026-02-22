import UserAvatar from "@/shared/components/UserAvatar";
import type { TaskType } from "../../types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import { memo, useCallback, useRef } from "react";
import { GripVertical } from "lucide-react";
import { truncateText } from "@/shared/utils/string";

function TaskCard({ task }: { task: TaskType }) {
  const navigate = useNavigate();
  const isDragEnabledRef = useRef(false);

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

  const handleTitleClick = useCallback((e: React.MouseEvent) => {
    if (!isDragEnabledRef.current) {
      e.stopPropagation();
      navigate(`/task/${task.id}`);
    }
  }, [navigate, task.id]);

  const handleUserClick = useCallback((e: React.MouseEvent) => {
    if (!isDragEnabledRef.current) {
      e.stopPropagation();
      if (task.assignee?.username) {
        navigate(`/profile/${task.assignee.username}`);
      }
    }
  }, [navigate, task.assignee?.username]);

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
        <div className="mt-1  flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h4
            onClick={handleTitleClick}
            className="text-xs font-medium text-gray-800 hover:text-gray-600 leading-tight break-words cursor-pointer line-clamp-2"
          >
            {truncateText(task.title, 50)}
          </h4>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
              {truncateText(task.description, 60)}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div
              data-clickable="true"
              className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleUserClick}
            >
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

export default memo(TaskCard);
