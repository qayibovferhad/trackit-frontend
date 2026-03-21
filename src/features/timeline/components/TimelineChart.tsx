import {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
  startTransition,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type { TeamOption } from "@/features/tasks/types/tasks";
import { getTeamMembersPaginated } from "@/features/teams/services/teams.service";
import { getTasksByTeam } from "@/features/tasks/services/tasks.service";
import { DAY_W, VISIBLE_DAYS, SIDEBAR_W } from "../constants";
import { assignLanes } from "../utils";
import { addDays, daysBetween, startOfDay } from "@/shared/utils/date";
import type { TimelineGroup } from "../types/timeline.types";
import TimelineHeader from "./TimelineHeader";
import TimelineDayHeader from "./TimelineDayHeader";
import TimelineAssigneeRow from "./TimelineAssigneeRow";
import TimelinePagination from "./TimelinePagination";

const MONTHS_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];


const StableTimelineHeader = memo(TimelineHeader, (prev, next) =>
  prev.viewStart.getMonth() === next.viewStart.getMonth() &&
  prev.viewStart.getFullYear() === next.viewStart.getFullYear() &&
  prev.selectedTeam?.id === next.selectedTeam?.id,
);
StableTimelineHeader.displayName = "StableTimelineHeader";

export default function TimelineChart() {
  const today = new Date();
  const todayStart = useMemo(() => startOfDay(today).getTime(), []);

  const [viewStart, setViewStart] = useState(() => startOfDay(addDays(today, -5)));
  const [selectedTeam, setSelectedTeam] = useState<TeamOption | null>(null);
  const [memberPage, setMemberPage] = useState(1);

  const handleTeamChange = useCallback((team: TeamOption | null) => {
    setSelectedTeam(team);
    setMemberPage(1);
  }, []);

  const teamId = selectedTeam?.id ?? null;

  const CHUNK = 7;
  const epoch = useMemo(() => new Date(0), []);
  const chunkIndex = useMemo(() => {
    const daysSinceEpoch = Math.floor(
      (viewStart.getTime() - epoch.getTime()) / (86400 * 1000),
    );
    return Math.floor(daysSinceEpoch / CHUNK);
  }, [viewStart, epoch]);

  const fetchFrom = useMemo(
    () => addDays(epoch, (chunkIndex - 1) * CHUNK),
    [chunkIndex, epoch],
  );
  const fetchTo = useMemo(
    () => addDays(epoch, (chunkIndex + 3) * CHUNK),
    [chunkIndex, epoch],
  );

  const { data: membersResult } = useQuery({
    queryKey: ["timeline-members", teamId, memberPage],
    queryFn: () => getTeamMembersPaginated(teamId!, memberPage),
    enabled: !!teamId,
  });

  const { data: rawTasks = [] } = useQuery({
    queryKey: ["timeline-tasks", teamId, chunkIndex],
    queryFn: async () => {
      const raw = await getTasksByTeam(teamId!, fetchFrom, fetchTo);
      return raw.map((t) => ({
        ...t,
        startDate: new Date(t.createdAt),
        dueAt: t.dueAt ? new Date(t.dueAt) : new Date(t.createdAt),
        status: (t as any).column?.type ?? "TODO",
        groupId: teamId!,
        groupName: selectedTeam!.label,
        cardW: 0,
      }));
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000,
  });

  const totalMembers = membersResult?.total ?? 0;
  const totalPages = Math.ceil(totalMembers / 5);

  const groups = useMemo<TimelineGroup[]>(() => {
    const memberList = membersResult?.data ?? [];
    return memberList.map((m) => {
      const memberTasks = rawTasks.filter((t) => t.assignee.id === m.userId);
      const { laneMap, laneCount } = assignLanes(memberTasks);
      const tasks = memberTasks.map((t) => ({
        ...t,
        cardW: Math.max(
          DAY_W - 8,
          (daysBetween(t.startDate, t.dueAt ?? t.startDate) + 1) * DAY_W - 8,
        ),
      }));
      return {
        id: m.userId,
        name: m.user.name ?? m.user.username ?? m.user.email,
        img: m.user.profileImage,
        tasks,
        laneMap,
        laneCount,
      };
    });
  }, [membersResult, rawTasks]);
  const viewStartMs = viewStart.getTime();

  const timelineW = VISIBLE_DAYS * DAY_W;

  const shiftPrev = useCallback(() => setViewStart((d) => addDays(d, -7)), []);
  const shiftNext = useCallback(() => setViewStart((d) => addDays(d, 7)), []);
  const pagePrev = useCallback(() => setMemberPage((p) => p - 1), []);
  const pageNext = useCallback(() => setMemberPage((p) => p + 1), []);

  const navLabel = useMemo(
    () => `${MONTHS_SHORT[viewStart.getMonth()]} ${viewStart.getFullYear()}`,
    [viewStart],
  );

  const chartRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ startX: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const onPanStart = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    e.preventDefault();
    panRef.current = { startX: e.clientX };
    if (chartRef.current) chartRef.current.style.cursor = "grabbing";
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!panRef.current) return;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!panRef.current || !chartRef.current) return;
        const dx = e.clientX - panRef.current.startX;
        chartRef.current.style.setProperty("--timeline-shift", `${dx}px`);
      });
    };
    const onUp = (e: PointerEvent) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (panRef.current && chartRef.current) {
        const dx = e.clientX - panRef.current.startX;
        const deltaDays = -Math.round(dx / DAY_W);
        chartRef.current.style.removeProperty("--timeline-shift");
        chartRef.current.style.cursor = "grab";
        if (deltaDays !== 0) setViewStart((d) => addDays(d, deltaDays));
      }
      panRef.current = null;
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

  const wheelAccRef = useRef(0);
  const wheelRafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccRef.current += delta;
      if (wheelRafRef.current !== null) return;
      wheelRafRef.current = requestAnimationFrame(() => {
        wheelRafRef.current = null;
        const snapped = Math.trunc(wheelAccRef.current / DAY_W);
        if (snapped !== 0) {
          wheelAccRef.current -= snapped * DAY_W;
          startTransition(() => setViewStart((d) => addDays(d, snapped)));
        }
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelRafRef.current) cancelAnimationFrame(wheelRafRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <StableTimelineHeader
        viewStart={viewStart}
        onNavigate={setViewStart}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
      />

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div ref={scrollContainerRef} className="overflow-y-auto overflow-x-hidden flex-1">
          <div
            ref={chartRef}
            style={{ minWidth: SIDEBAR_W + timelineW, cursor: "grab" }}
            onPointerDown={onPanStart}
          >
            <TimelineDayHeader
              viewStartMs={viewStartMs}
              todayStart={todayStart}
              navLabel={navLabel}
              onPrev={shiftPrev}
              onNext={shiftNext}
            />

            <div className="relative">
              {groups.map((group) => (
                <TimelineAssigneeRow
                  key={group.id}
                  group={group}
                  viewStartMs={viewStartMs}
                  todayStart={todayStart}
                  timelineW={timelineW}
                />
              ))}
            </div>

            <TimelinePagination
              page={memberPage}
              totalPages={totalPages}
              onPrev={pagePrev}
              onNext={pageNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}