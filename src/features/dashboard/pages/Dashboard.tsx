import type { WidgetId } from "../types";
import HeroCard from "@/shared/components/HeroCard";
import type { WidgetConfig } from "@/shared/components/DraggableWidgetLayout";
import DraggableWidgetLayout from "@/shared/components/DraggableWidgetLayout";
import { lazy, Suspense, useMemo } from "react";

const TeamsPerformanceWidget = lazy(() => import("../components/TeamsPerformance"));
const TaskStatusWidget = lazy(() => import("../components/TaskStatus"));
const DoneTasksWidget = lazy(() => import("../components/DoneTasks"));


export default function Dashboard() {
  const widgets: WidgetConfig<WidgetId>[] = useMemo(() => [
    {
      id: "hero",
      component: <HeroCard />,
      fullWidth: true,
    },
    {
      id: "tasksDone",
      component: <Suspense fallback={null}><DoneTasksWidget /></Suspense>,
      fullWidth: false,
    },
    {
      id: "taskStatus",
      component: <Suspense fallback={null}><TaskStatusWidget /></Suspense>,
      fullWidth: false,
    },
    {
      id: "teamsPerformance",
      component: <Suspense fallback={null}><TeamsPerformanceWidget /></Suspense>,
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