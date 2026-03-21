import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import { DAY_W, HEADER_H } from "../constants";
import TimelineNavButtons from "./TimelineNavButtons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TimelineDayHeaderProps {
  days: Date[];
  todayStart: number;
  navLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

function TimelineDayHeaderInner({
  days,
  todayStart,
  navLabel,
  onPrev,
  onNext,
}: TimelineDayHeaderProps) {
  return (
    <div
      className="flex sticky top-0 z-20 bg-white border-b border-gray-100"
      style={{ height: HEADER_H }}
    >
      <TimelineNavButtons label={navLabel} onPrev={onPrev} onNext={onNext} />

      <div className="flex-1 overflow-hidden">
        <div className="flex" style={{ transform: "translateX(var(--timeline-shift, 0px))" }}>
          {days.map((day, i) => {
            const isToday = day.getTime() === todayStart;
            return (
              <div
                key={i}
                style={{ width: DAY_W, flexShrink: 0 }}
                className={cn(
                  "flex flex-col items-center justify-center border-r border-gray-100 text-sm select-none",
                  isToday ? "text-indigo-600 font-bold" : "text-gray-400 font-normal"
                )}
              >
                <span className="text-[11px] uppercase">{WEEKDAYS[day.getDay()]}</span>
                <span className={cn(
                  "text-sm leading-none mt-0.5",
                  isToday && "bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                )}>
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const TimelineDayHeader = memo(TimelineDayHeaderInner, (prev, next) =>
  prev.days[0]?.getTime() === next.days[0]?.getTime() &&
  prev.todayStart === next.todayStart &&
  prev.navLabel === next.navLabel &&
  prev.onPrev === next.onPrev &&
  prev.onNext === next.onNext
);

export default TimelineDayHeader;
