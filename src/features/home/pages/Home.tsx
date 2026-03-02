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
import AnnouncementModal from "@/features/announcements/components/AnnouncementModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnnouncement } from "@/features/announcements/services/announcements.service";
import { toast } from "sonner";
import type { AnnouncementFormData } from "@/features/announcements/schemas/announcement.schema";

export default function Home() {
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addAnnouncementOpen, setAddAnnouncementOpen] = useState(false);
  const { user } = useUserStore();
  const { createTaskMutation } = useTaskMutations();
  const queryClient = useQueryClient();

  function handleAddTask(payload: CreateTaskPayload) {
    createTaskMutation.mutate(payload);
  }

  const { mutate: createAnnouncementMutation, isPending: isCreatingAnnouncement } = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setAddAnnouncementOpen(false);
      toast.success("Announcement created");
    },
    onError: () => toast.error("Failed to create announcement"),
  });

  const addTaskButton = (
    <Button size="sm" variant="soft" className="gap-1 h-8 text-sm px-3" onClick={() => setAddTaskOpen(true)}>
      <Plus size={15} />
      Add Task
    </Button>
  );

  const addAnnouncementButton = (
    <Button size="sm" variant="soft" className="gap-1 h-8 text-sm px-3" onClick={() => setAddAnnouncementOpen(true)}>
      <Plus size={15} />
      Add Announcement
    </Button>
  );

  const widgets: WidgetConfig<WidgetId>[] = [
    { id: "hero", component: <HeroCard />, fullWidth: true },
    { id: "tasks", component: <TasksPriorities />, fullWidth: false, actions: addTaskButton },
    { id: "announcements", component: <AnnouncementsWidget />, fullWidth: false, actions: addAnnouncementButton },
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
      <AnnouncementModal
        open={addAnnouncementOpen}
        onOpenChange={setAddAnnouncementOpen}
        mode="create"
        onSubmit={(data: AnnouncementFormData) => createAnnouncementMutation(data)}
        isLoading={isCreatingAnnouncement}
      />
    </>
  );
}
