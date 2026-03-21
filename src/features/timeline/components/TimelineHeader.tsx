import { useState, useCallback } from "react";
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
import PageHeader from "@/layouts/AppLayout/components/PageHeader";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";
import { fetchSharedTeams } from "@/features/teams/services/teams.service";
import { useUserStore } from "@/stores/userStore";
import type { Team } from "@/features/teams/types";
import type { TeamOption } from "@/features/tasks/types/tasks";

interface TimelineHeaderProps {
  viewStart: Date;
  onNavigate: (date: Date) => void;
  selectedTeam: TeamOption | null;
  onTeamChange: (team: TeamOption | null) => void;
}

export default function TimelineHeader({ viewStart, onNavigate, selectedTeam, onTeamChange }: TimelineHeaderProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(viewStart.getMonth());
  const [year, setYear] = useState(viewStart.getFullYear());
  const user = useUserStore((s) => s.user);

  const fetchTeamOptions = useCallback(async (input: string): Promise<TeamOption[]> => {
    if (!input || input.length < 2) return [];
    try {
      const data = await fetchSharedTeams(input, user?.id ?? "");
      return (data ?? []).map((team: Team) => ({ id: team.id, value: team.id, label: team.name }));
    } catch {
      return [];
    }
  }, [user?.id]);

  const apply = () => {
    onNavigate(new Date(year, month, 1));
    setOpen(false);
  };

  return (
    <PageHeader
      title="Timeline"
      subtitle="Create and complete tasks using boards"
      actions={
        <>
          <div className="w-48 relative z-50">
            <GenericAsyncSelect<TeamOption>
              value={selectedTeam ? [selectedTeam] : []}
              onChange={(opts) => onTeamChange(opts[0] ?? null)}
              placeholder="Filter by team..."
              loadOptions={fetchTeamOptions}
              allowCreateOption={false}
              isMulti={false}
              noOptionsMessage={() => "No team found"}

            />
          </div>

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
        </>
      }
    />
  );
}
