import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import type { TimelineTask } from "../types/timeline.types";
import type { TeamOption } from "@/features/tasks/types/tasks";
import { getTeamMembersPaginated } from "@/features/teams/services/teams.service";
import { getTasksByTeam } from "@/features/tasks/services/tasks.service";
import { DAY_W, HEADER_H, SIDEBAR_W, CARD_H, VISIBLE_DAYS, STATUS_COLOR } from "../constants";
import { assignLanes, cardTop, rowHeight } from "../utils";
import { addDays, daysBetween, fmtShort, isSameDay, startOfDay } from "@/shared/utils/date";
import TimelineHeader from "./TimelineHeader";

// ── component ─────────────────────────────────────────────────────────────────
export default function TimelineChart() {
  const today = new Date();

  // viewStart = first day shown (default: 5 days before today)
  const [viewStart, setViewStart] = useState(() => startOfDay(addDays(today, -5)));
  const [selectedTeam, setSelectedTeam] = useState<TeamOption | null>(null);
  const [memberPage, setMemberPage] = useState(1);

  const handleTeamChange = (team: TeamOption | null) => {
    setSelectedTeam(team);
    setMemberPage(1);
  };
  const teamId = selectedTeam?.id ?? null;

  const { data: membersResult } = useQuery({
    queryKey: ["timeline-members", teamId, memberPage],
    queryFn: () => getTeamMembersPaginated(teamId!, memberPage),
    enabled: !!teamId,
  });

  const members = membersResult?.data ?? [];
  const totalMembers = membersResult?.total ?? 0;
  const totalPages = Math.ceil(totalMembers / 5);

  const { data: tasks = [] } = useQuery<TimelineTask[]>({
    queryKey: ["timeline-tasks", teamId],
    queryFn: async () => {
      const raw = await getTasksByTeam(teamId!);
      return raw.map((t) => ({
        ...t,
        startDate: new Date(t.createdAt),
        dueAt: t.dueAt ? new Date(t.dueAt) : new Date(t.createdAt),
        status: (t as any).column?.type ?? "TODO",
        groupId: teamId!,
        groupName: selectedTeam!.label,
      }));
    },
    enabled: !!teamId,
  });

  const days = Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(viewStart, i));

  const shift = (n: number) => setViewStart((d) => addDays(d, n));

  // ── pan (drag timeline to scroll days) ──
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{ startX: number; startViewStart: Date } | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const onPanStart = (e: React.PointerEvent) => {
    e.preventDefault();
    panRef.current = { startX: e.clientX, startViewStart: viewStart };
    setIsPanning(true);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!panRef.current) return;
      if (rafRef.current !== null) return; // already queued for this frame
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!panRef.current) return;
        const dx = e.clientX - panRef.current.startX;
        const deltaDays = -Math.round(dx / DAY_W);
        setViewStart(addDays(panRef.current.startViewStart, deltaDays));
      });
    };
    const onUp = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      panRef.current = null;
      setIsPanning(false);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // disable wheel/trackpad scroll on the chart — only grab navigates
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // group by member — each team member is a row, tasks filtered by assignee
  const groups = useMemo(() => {
    return members.map((m) => ({
      id: m.userId,
      name: m.user.name ?? m.user.username ?? m.user.email,
      img: m.user.profileImage,
      tasks: tasks.filter((t) => t.assignee.id === m.userId),
    }));
  }, [members, tasks]);

  // x offset (relative to timeline area, i.e. right of sidebar)
  const toX = (d: Date) => daysBetween(viewStart, d) * DAY_W;

  const timelineW = VISIBLE_DAYS * DAY_W;

  return (
    <div className="flex flex-col gap-4 h-full">
      <TimelineHeader
        viewStart={viewStart}
        onNavigate={setViewStart}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
      />

      {/* ── chart ── */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div ref={scrollContainerRef} className="overflow-y-auto overflow-x-hidden flex-1">
          <div style={{ minWidth: SIDEBAR_W + timelineW }}>

            {/* day-number header */}
            <div
              className="flex sticky top-0 z-20 bg-white border-b border-gray-100"
              style={{ height: HEADER_H }}
            >
              {/* sidebar header */}
              <div
                className="sticky left-0 z-30 bg-white border-r border-gray-100 flex items-center gap-2 px-4 shrink-0"
                style={{ width: SIDEBAR_W }}
              >
                <Button variant="ghost" size="icon" className="size-7" onClick={() => shift(-7)}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs font-semibold text-gray-500 flex-1 text-center">
                  {viewStart.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                <Button variant="ghost" size="icon" className="size-7" onClick={() => shift(7)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              {/* day numbers — draggable */}
              {days.map((day) => {
                const isToday = isSameDay(day, today);
                return (
                  <div
                    key={day.getTime()}
                    style={{ width: DAY_W, cursor: isPanning ? "grabbing" : "grab" }}
                    className={cn(
                      "shrink-0 flex flex-col items-center justify-center border-r border-gray-100 text-sm select-none",
                      isToday ? "text-indigo-600 font-bold" : "text-gray-400 font-normal"
                    )}
                    onPointerDown={onPanStart}
                  >
                    <span className="text-[11px] uppercase">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
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

            {/* assignee rows */}
            <div className="relative">
              {groups.map((group) => {
                const { laneMap, laneCount } = assignLanes(group.tasks);
                const rh = rowHeight(Math.max(1, laneCount));
                return (
                <div
                  key={group.id}
                  className="flex border-b border-gray-100 last:border-b-0"
                  style={{ height: rh }}
                >
                  {/* assignee cell */}
                  <div
                    className="sticky left-0 z-10 bg-white border-r border-gray-100 flex items-start gap-2.5 px-4 pt-4 shrink-0"
                    style={{ width: SIDEBAR_W }}
                  >
                    {group.img ? (
                      <img src={group.img} className="size-7 rounded-full border border-gray-200 shrink-0" />
                    ) : (
                      <div className="size-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 truncate mt-0.5">{group.name}</span>
                    <MoreHorizontal className="size-4 text-gray-300 ml-auto shrink-0 mt-0.5" />
                  </div>

                  {/* task cards — pointerdown starts pan, cards stop propagation */}
                  <div
                    className="relative"
                    style={{ width: timelineW, cursor: isPanning ? "grabbing" : "grab" }}
                    onPointerDown={onPanStart}
                  >
                    {/* column grid lines */}
                    {days.map((day, i) => (
                      <div
                        key={i}
                        className={cn(
                          "absolute top-0 bottom-0 border-r border-gray-50",
                          isSameDay(day, today) && "bg-indigo-50/40"
                        )}
                        style={{ left: i * DAY_W, width: DAY_W }}
                      />
                    ))}

                    {/* today vertical line */}
                    {(() => {
                      const tx = toX(today) + DAY_W / 2;
                      return tx >= 0 && tx <= timelineW ? (
                        <div
                          className="absolute top-0 bottom-0 w-px bg-indigo-300 opacity-60 z-10"
                          style={{ left: tx }}
                        />
                      ) : null;
                    })()}

                    {group.tasks
                      .filter((t) => toX(t.dueAt) + DAY_W > 0 && toX(t.startDate) < timelineW)
                      .map((task) => {
                        const x = toX(task.startDate) + 4;
                        const spanDays = Math.max(1, daysBetween(task.startDate, task.dueAt) + 1);
                        const w = Math.max(DAY_W - 8, spanDays * DAY_W - 8);
                        const isDone = task.status === "DONE";
                        const lane = laneMap.get(task.id) ?? 0;

                        return (
                          <div
                            key={task.id}
                            className="absolute bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                            style={{ left: x, top: cardTop(lane), width: w, height: CARD_H }}
                            onPointerDown={onPanStart}
                          >
                            <div className="flex items-start gap-2 h-full">
                              {/* checkbox */}
                              <div
                                className={cn(
                                  "mt-0.5 size-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
                                  STATUS_COLOR[task.status] ?? "border-gray-300"
                                )}
                              >
                                {isDone && <Check className="size-2.5 text-white" strokeWidth={3} />}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className={cn(
                                  "text-sm font-semibold leading-tight truncate",
                                  isDone ? "text-gray-400 line-through" : "text-gray-800"
                                )}>
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
                          </div>
                        );
                      })}
                  </div>
                </div>
                );
              })}
            </div>

            {/* footer */}
            <div className="py-3 px-4 flex items-center justify-between border-t border-gray-100">
              <span className="text-sm text-gray-400">
                Add more members by{" "}
                <span className="text-indigo-500 cursor-pointer hover:underline font-medium">
                  +Inviting
                </span>
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={memberPage === 1}
                    onClick={() => setMemberPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-xs text-gray-500">
                    {memberPage} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={memberPage === totalPages}
                    onClick={() => setMemberPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
