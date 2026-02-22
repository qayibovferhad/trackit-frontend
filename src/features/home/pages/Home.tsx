import HeroCard from "@/shared/components/HeroCard";
import type { WidgetId } from "../types";
import type { WidgetConfig } from "@/shared/components/DraggableWidgetLayout";
import DraggableWidgetLayout from "@/shared/components/DraggableWidgetLayout";
import TasksPriorities from "../components/TasksPriorities";
import MyTeams from "../components/MyTeams";
import { useMemo } from "react";



const Announcements = () => {
  return (
    <div className="rounded-xl border bg-white p-5 h-[500px] flex flex-col">
      <div className="flex-shrink-0">
        <h3 className="font-semibold">Announcements</h3>
        <p className="text-sm text-gray-500">From personal and team project</p>
      </div>

      <ul className="mt-4 space-y-4 overflow-y-auto flex-1">
        <li>
          <p className="text-sm font-medium">
            We have fixed our app's bugs based on test results
          </p>
          <p className="text-xs text-gray-500">
            25 Aug 2022 · From Anderson
          </p>
        </li>

        <li>
          <p className="text-sm font-medium">
            Feature 1: Login and signing screen
          </p>
          <p className="text-xs text-gray-500">
            25 Aug 2022 · From Emily
          </p>
        </li>
      </ul>
    </div>
  );
};



export default function Home() {
  const widgets: WidgetConfig<WidgetId>[] = useMemo(() => [
    {
      id: "hero",
      component: <HeroCard />,
      fullWidth: true,
    },
    {
      id: "tasks",
      component: <TasksPriorities />,
      fullWidth: false,
    },
    {
      id: "announcements",
      component: <Announcements />,
      fullWidth: false,
    },
    {
      id: "teams",
      component: <MyTeams />,
      fullWidth: false,
    },
  ], []);

  const defaultOrder: WidgetId[] = useMemo(() => ["hero", "tasks", "announcements", "teams"], []);


  return (
   <DraggableWidgetLayout
      widgets={widgets}
      defaultOrder={defaultOrder}
      localStorageKey="homeWidgetOrder"
      className="min-h-screen p-6"
    />
  );
}

