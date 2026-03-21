import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface TimelinePaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function TimelinePagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: TimelinePaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="py-3 px-4 flex items-center justify-end border-t border-gray-100">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-7" disabled={page === 1} onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-xs text-gray-500">{page} / {totalPages}</span>
        <Button variant="ghost" size="icon" className="size-7" disabled={page === totalPages} onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
