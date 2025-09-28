import UserAvatar from "@/shared/components/UserAvatar";
import type { TaskType } from "../../types/tasks";

export default function TaskCard({ task }: { task: TaskType }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 mb-3">
      <div className="flex items-start gap-3">
        <input type="checkbox" className="mt-1 w-4 h-4 text-violet-600" />
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-800 leading-tight whitespace-normal break-words ">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 truncate max-w-[120px]">
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={task.assignee?.username}
                src={task.assignee?.profileImage}
                size="sm"
              />
              <span className="truncate max-w-[100px]">
                {task.assignee?.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>{task.date}</span>
              {task.priority && (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">
                  {task.priority}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
