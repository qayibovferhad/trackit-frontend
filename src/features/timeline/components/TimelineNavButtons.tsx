import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SIDEBAR_W } from "../constants";

interface TimelineNavButtonsProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

const TimelineNavButtons = memo(function TimelineNavButtons({
  label,
  onPrev,
  onNext,
}: TimelineNavButtonsProps) {
  return (
    <div
      className="sticky left-0 z-30 bg-white border-r border-gray-100 flex items-center gap-2 px-4 shrink-0"
      style={{ width: SIDEBAR_W }}
    >
      <Button variant="ghost" size="icon" className="size-7" onClick={onPrev}>
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-xs font-semibold text-gray-500 flex-1 text-center">{label}</span>
      <Button variant="ghost" size="icon" className="size-7" onClick={onNext}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
});

export default TimelineNavButtons;
