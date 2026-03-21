import { memo, useMemo } from "react";
import { DAY_W, HEADER_H, VISIBLE_DAYS } from "../constants";
import TimelineNavButtons from "./TimelineNavButtons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CELL_CLS =
  "flex flex-col items-center justify-center border-r border-gray-100 text-sm select-none text-gray-400 font-normal";
const CELL_TODAY_CLS =
  "flex flex-col items-center justify-center border-r border-gray-100 text-sm select-none text-indigo-600 font-bold";
const NUM_CLS = "text-sm leading-none mt-0.5";
const NUM_TODAY_CLS =
  "text-sm leading-none mt-0.5 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center";


interface TimelineDayHeaderProps {
  viewStartMs: number;
  todayStart: number;
  navLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

const TimelineDayHeader = memo(function TimelineDayHeader({
  viewStartMs,
  todayStart,
  navLabel,
  onPrev,
  onNext,
}: TimelineDayHeaderProps) {
  // Date obyektləri yaratmaq əvəzinə sadə riyazi hesablama
  const dayTimestamps = useMemo(() => {
    const MS_PER_DAY = 86_400_000;
    return Array.from({ length: VISIBLE_DAYS }, (_, i) => viewStartMs + i * MS_PER_DAY);
  }, [viewStartMs]);

  return (
    <div
      className="flex sticky top-0 z-20 bg-white border-b border-gray-100"
      style={{ height: HEADER_H }}
    >
      <TimelineNavButtons label={navLabel} onPrev={onPrev} onNext={onNext} />

      <div className="flex-1 overflow-hidden">
        <div
          className="flex"
          style={{ transform: "translateX(var(--timeline-shift, 0px))" }}
        >
          {dayTimestamps.map((ms, i) => {
            const day = new Date(ms);
            const isToday = ms === todayStart;
            return (
              <div
                key={i}
                style={{ width: DAY_W, flexShrink: 0 }}
                className={isToday ? CELL_TODAY_CLS : CELL_CLS}
              >
                <span className="text-[11px] uppercase">{WEEKDAYS[day.getDay()]}</span>
                <span className={isToday ? NUM_TODAY_CLS : NUM_CLS}>{day.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

TimelineDayHeader.displayName = "TimelineDayHeader";
export default TimelineDayHeader;