import { useState } from "react";
import { Calendar, Plus, UserPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { MONTHS } from "../constants";

interface TimelineHeaderProps {
  viewStart: Date;
  onNavigate: (date: Date) => void;
}

export default function TimelineHeader({ viewStart, onNavigate }: TimelineHeaderProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(viewStart.getMonth());
  const [year, setYear] = useState(viewStart.getFullYear());

  const apply = () => {
    onNavigate(new Date(year, month, 1));
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
        <p className="text-sm text-gray-400 mt-0.5">Create and complete tasks using boards</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Date picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Calendar className="size-4 text-gray-400" />
              {viewStart.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select month</p>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select year</p>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2026, 2027].map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="w-full mt-1" size="sm" onClick={apply}>
              Apply
            </Button>
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="sm">
          <UserPlus className="size-4" />
          Invite
        </Button>

        <Button size="sm">
          <Plus className="size-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
