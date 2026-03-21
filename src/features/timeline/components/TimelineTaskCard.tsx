import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { fmtShort } from "@/shared/utils/date";
import type { TimelineTask } from "../types/timeline.types";
import { STATUS_COLOR } from "../constants";

interface TimelineTaskCardProps {
  task: TimelineTask;
  onTitleClick: () => void;
}

const TimelineTaskCard = memo(function TimelineTaskCard({
  task,
  onTitleClick,
}: TimelineTaskCardProps) {
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
          onClick={onTitleClick}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {task.assignee.profileImage ? (
            <img src={task.assignee.profileImage} className="size-4 rounded-full" />
          ) : (
            <div className="size-4 rounded-full bg-indigo-400 flex items-center justify-center text-[9px] text-white font-bold shrink-0">
              {(task.assignee.name ?? task.assignee.username).charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[11px] text-gray-400 truncate">
            {fmtShort(task.startDate)} to {fmtShort(task.dueAt)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default TimelineTaskCard;
