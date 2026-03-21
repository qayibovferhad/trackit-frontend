import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { fmtShort } from "@/shared/utils/date";
import type { TimelineTask } from "../types/timeline.types";
import { STATUS_COLOR } from "../constants";
import UserAvatar from "@/shared/components/UserAvatar";

interface TimelineTaskCardProps {
  task: TimelineTask;
}

const TimelineTaskCard = memo(function TimelineTaskCard({
  task,
}: TimelineTaskCardProps) {
  console.log("[render] TimelineTaskCard", { taskId: task.id, title: task.title });
  const navigate = useNavigate();
  const isDone = task.status === "DONE";
  return (
    <div className="flex items-start gap-2 h-full">
      <div className={cn(
        "mt-0.5 size-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
        STATUS_COLOR[task.status] ?? "border-gray-300"
      )}>
        {isDone && <Check className="size-2.5 text-white" strokeWidth={3} />}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold leading-tight truncate hover:text-indigo-600 hover:underline cursor-pointer",
            isDone ? "text-gray-400 line-through" : "text-gray-800"
          )}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => navigate(`/task/${task.id}`)}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <UserAvatar src={task.assignee.profileImage} name={task.assignee.name} size="sm" className="h-4 w-4" fallbackClassName="text-[9px]" />
          <span className="text-[11px] text-gray-400 truncate">
            {fmtShort(task.startDate)} to {fmtShort(task.dueAt)}
          </span>
        </div>
      </div>
    </div>
  );
});

TimelineTaskCard.displayName = "TimelineTaskCard";
export default TimelineTaskCard;
