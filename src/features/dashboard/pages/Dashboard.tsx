import type { WidgetId } from "../types";
import HeroCard from "@/shared/components/HeroCard";
import type { WidgetConfig } from "@/shared/components/DraggableWidgetLayout";
import DraggableWidgetLayout from "@/shared/components/DraggableWidgetLayout";
import TeamsPerformanceWidget from "../components/TeamsPerformance";
import TaskStatusWidget from "../components/TaskStatus";
import DoneTasksWidget from "../components/DoneTasks";
import { useMemo } from "react";


export default function Dashboard() {
  const widgets: WidgetConfig<WidgetId>[] = useMemo(() => [
    {
      id: "hero",
      component: <HeroCard />,
      fullWidth: true,
    },
    {
      id: "tasksDone",
      component: <DoneTasksWidget />,
      fullWidth: false,
    },
    {
      id: "taskStatus",
      component: <TaskStatusWidget />,
      fullWidth: false,
    },
    {
      id: "teamsPerformance",
      component: <TeamsPerformanceWidget />,
      fullWidth: false,
    },
  ], []);

  const defaultOrder: WidgetId[] = useMemo(() => [
    "hero",
    "tasksDone",
    "taskStatus",
    "teamsPerformance",
  ], []);

  return (
    <DraggableWidgetLayout
      widgets={widgets}
      defaultOrder={defaultOrder}
      localStorageKey="dashboardWidgetOrder"
      className="min-h-screen overflow-x-hidden"
    />
  );
}