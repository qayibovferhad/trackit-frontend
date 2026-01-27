import { randomColors } from "@/shared/constants/colors";
import type { TaskType } from "../../types/tasks";
import { Calendar, Edit2, MoreHorizontal, Tag, Trash2 } from "lucide-react";
import { formatDate } from "@/shared/utils/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRow,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { getTagColor } from "../../utils/task";



export default function TaskItem({
  task,
  onEdit,
  onDelete,
  isSubtask = false,
}: {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
  isSubtask?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-${
        isSubtask ? "2" : "6"
      } rounded-lg hover:bg-gray-50 transition-colors group ${
        !isSubtask ? "border-b border-gray-200" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        {!isSubtask && (
          <h1 className="text-base font-semibold text-gray-700 mb-3">
            {task.title}
          </h1>
        )}
        {isSubtask && (
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            {task.title}
          </h3>
        )}
        {!isSubtask && task.description && (
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        )}
        <div
          className={`flex items-center gap-4 ${
            isSubtask ? "text-xs" : "text-sm"
          } text-gray-600`}
        >
          {!!task.dueAt &&<div className="flex items-center gap-1.5">
            <Calendar className={`${isSubtask ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
            <span>{formatDate(task.dueAt)}</span>
          </div>}
          {task?.tags && task?.tags.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <Tag className={`${isSubtask ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
              <div className="flex gap-2 flex-wrap">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded text-xs ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
              No Tag
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Created By</span>
            <span className="font-medium text-violet-600">
              {task.assignee.name || task.assignee.username}
            </span>
          </div>
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Task options"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-7">
          <DropdownMenuRow
            iconCircle
            icon={<Edit2 />}
            label="Edit"
            iconSize={4}
            onClick={() => onEdit(task)}
          />
          <DropdownMenuRow
            iconCircle
            icon={<Trash2 />}
            label="Delete"
            iconSize={4}
            onClick={() => onDelete(task)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
