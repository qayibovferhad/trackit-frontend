import { memo, useMemo } from "react";
import { DAY_W, CARD_H, VISIBLE_DAYS } from "../constants";
import { cardTop, rowHeight } from "../utils";
import { startOfDay } from "@/shared/utils/date";
import type { TimelineGroup } from "../types/timeline.types";
import TimelineAssigneeSidebar from "./TimelineAssigneeSidebar";
import TimelineTaskCard from "./TimelineTaskCard";

const GRID_CLS =
  "absolute top-0 bottom-0 border-r border-gray-50";
const GRID_TODAY_CLS =
  "absolute top-0 bottom-0 border-r border-gray-50 bg-indigo-50/40";

interface GridLinesProps {
  viewStartMs: number;
  todayStart: number;
  timelineW: number;
}

const GridLines = memo(function GridLines({
  viewStartMs,
  todayStart,
  timelineW,
}: GridLinesProps) {
  const MS_PER_DAY = 86_400_000;

  const cells = useMemo(() => {
    const result: { ms: number; left: number; isToday: boolean }[] = [];
    for (let i = 0; i < VISIBLE_DAYS; i++) {
      const ms = viewStartMs + i * MS_PER_DAY;
      result.push({ ms, left: i * DAY_W, isToday: ms === todayStart });
    }
    return result;
  }, [viewStartMs, todayStart]);

  const todayX = useMemo(() => {
    const diff = Math.round((todayStart - viewStartMs) / MS_PER_DAY);
    return diff * DAY_W + DAY_W / 2;
  }, [viewStartMs, todayStart]);

  return (
    <>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={cell.isToday ? GRID_TODAY_CLS : GRID_CLS}
          style={{ left: cell.left, width: DAY_W }}
        />
      ))}
      {todayX >= 0 && todayX <= timelineW && (
        <div
          className="absolute top-0 bottom-0 w-px bg-indigo-300 opacity-60 z-10"
          style={{ left: todayX }}
        />
      )}
    </>
  );
});
GridLines.displayName = "GridLines";

interface PositionedTaskProps {
  task: TimelineGroup["tasks"][number];
  x: number;
  y: number;
}

const PositionedTask = memo(function PositionedTask({
  task,
  x,
  y,
}: PositionedTaskProps) {
  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
      style={{ left: x, top: y, width: task.cardW, height: CARD_H }}
    >
      <TimelineTaskCard task={task} />
    </div>
  );
});
PositionedTask.displayName = "PositionedTask";


interface TimelineAssigneeRowProps {
  group: TimelineGroup;
  viewStartMs: number;
  todayStart: number;
  timelineW: number;
}

const TimelineAssigneeRow = memo(function TimelineAssigneeRow({
  group,
  viewStartMs,
  todayStart,
  timelineW,
}: TimelineAssigneeRowProps) {
  const rh = rowHeight(Math.max(1, group.laneCount));

  const MS_PER_DAY = 86_400_000;

  const visibleTasks = useMemo(() => {
    return group.tasks
      .map((task) => {
        const startMs = startOfDay(task.startDate).getTime();
        const endMs = startOfDay(task.dueAt).getTime();
        const x = Math.round((startMs - viewStartMs) / MS_PER_DAY) * DAY_W + 4;
        const endX = Math.round((endMs - viewStartMs) / MS_PER_DAY) * DAY_W + DAY_W;
        if (endX <= 0 || x >= timelineW) return null;
        const lane = group.laneMap.get(task.id) ?? 0;
        const y = cardTop(lane);
        return { task, x, y };
      })
      .filter(Boolean) as { task: TimelineGroup["tasks"][number]; x: number; y: number }[];
  }, [group.tasks, group.laneMap, viewStartMs, timelineW]);

  return (
    <div
      className="flex border-b border-gray-100 last:border-b-0"
      style={{ height: rh }}
    >
      <TimelineAssigneeSidebar name={group.name} img={group.img} />

      <div className="overflow-hidden" style={{ width: timelineW }}>
        <div
          className="relative"
          style={{
            width: timelineW,
            height: "100%",
            transform: "translateX(var(--timeline-shift, 0px))",
          }}
        >
          <GridLines
            viewStartMs={viewStartMs}
            todayStart={todayStart}
            timelineW={timelineW}
          />

          {visibleTasks.map(({ task, x, y }) => (
            <PositionedTask key={task.id} task={task} x={x} y={y} />
          ))}
        </div>
      </div>
    </div>
  );
});

TimelineAssigneeRow.displayName = "TimelineAssigneeRow";
export default TimelineAssigneeRow;