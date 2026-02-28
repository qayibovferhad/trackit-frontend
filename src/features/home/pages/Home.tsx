import { useState } from "react";
import { Plus } from "lucide-react";
import HeroCard from "@/shared/components/HeroCard";
import DraggableWidgetLayout from "@/shared/components/DraggableWidgetLayout";
import type { WidgetConfig } from "@/shared/components/DraggableWidgetLayout";
import TasksPriorities from "../components/TasksPriorities";
import MyTeams from "../components/MyTeams";
import TaskModal from "@/features/tasks/components/task/TaskModal";
import { Button } from "@/shared/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";
import type { CreateTaskPayload } from "@/features/tasks/types/tasks";
import type { WidgetId } from "../types";
import AnnouncementsWidget from "@/features/announcements/components/AnnouncementsWidget";

export default function Home() {
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const { user } = useUserStore();
  const { createTaskMutation } = useTaskMutations();

  function handleAddTask(payload: CreateTaskPayload) {
    createTaskMutation.mutate(payload);
  }

  const addTaskButton = (
    <Button size="sm" variant="soft" className="gap-1 h-8 text-sm px-3" onClick={() => setAddTaskOpen(true)}>
      <Plus size={15} />
      Add Task
    </Button>
  );

  const widgets: WidgetConfig<WidgetId>[] = [
    { id: "hero", component: <HeroCard />, fullWidth: true },
    { id: "tasks", component: <TasksPriorities />, fullWidth: false, actions: addTaskButton },
    { id: "announcements", component: <AnnouncementsWidget />, fullWidth: false },
    { id: "teams", component: <MyTeams />, fullWidth: false },
  ];

  const defaultOrder: WidgetId[] = ["hero", "tasks", "announcements", "teams"];

  return (
    <>
      <DraggableWidgetLayout
        widgets={widgets}
        defaultOrder={defaultOrder}
        localStorageKey="homeWidgetOrder"
        className="min-h-screen p-6"
      />
      <TaskModal
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        defaultUser={user}
        onAddTask={handleAddTask}
      />
    </>
  );
}
