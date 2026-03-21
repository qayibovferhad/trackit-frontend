import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { DAY_W, CARD_H } from "../constants";
import { cardTop, rowHeight } from "../utils";
import type { TimelineGroup } from "../types/timeline.types";
import TimelineAssigneeSidebar from "./TimelineAssigneeSidebar";
import TimelineTaskCard from "./TimelineTaskCard";

interface TimelineAssigneeRowProps {
  group: TimelineGroup;
  days: Date[];
  todayStart: number;
  todayX: number;
  timelineW: number;
  toX: (d: Date) => number;
}

export default function TimelineAssigneeRow({
  group,
  days,
  todayStart,
  todayX,
  timelineW,
  toX,
}: TimelineAssigneeRowProps) {
  const navigate = useNavigate();
  const rh = rowHeight(Math.max(1, group.laneCount));

  return (
    <div
      className="flex border-b border-gray-100 last:border-b-0"
      style={{ height: rh }}
    >
      <TimelineAssigneeSidebar name={group.name} img={group.img} />

      <div className="overflow-hidden" style={{ width: timelineW }}>
        <div
          className="relative"
          style={{ width: timelineW, height: "100%", transform: "translateX(var(--timeline-shift, 0px))" }}
        >
          {/* grid lines */}
          {days.map((day, i) => (
            <div
              key={i}
              className={cn(
                "absolute top-0 bottom-0 border-r border-gray-50",
                day.getTime() === todayStart && "bg-indigo-50/40"
              )}
              style={{ left: i * DAY_W, width: DAY_W }}
            />
          ))}

          {/* today line */}
          {todayX >= 0 && todayX <= timelineW && (
            <div
              className="absolute top-0 bottom-0 w-px bg-indigo-300 opacity-60 z-10"
              style={{ left: todayX }}
            />
          )}

          {/* task cards */}
          {group.tasks
            .filter((t) => toX(t.dueAt) + DAY_W > 0 && toX(t.startDate) < timelineW)
            .map((task) => {
              const x = toX(task.startDate) + 4;
              const lane = group.laneMap.get(task.id) ?? 0;
              return (
                <div
                  key={task.id}
                  className="absolute bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                  style={{ left: x, top: cardTop(lane), width: task.cardW, height: CARD_H }}
                >
                  <TimelineTaskCard
                    task={task}
                    onTitleClick={() => navigate(`/task/${task.id}`)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
