import { useTasksQuery } from "@/features/tasks/hooks/useTasks";
import type { TaskFilter } from "@/features/tasks/types/tasks";
import TeamModal from "@/features/teams/components/TeamModal";
import { useTeamsQuery } from "@/features/teams/hooks/useTeams";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import HeroCard from "@/shared/components/HeroCard";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/utils/date";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";
import { GripVertical, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type WidgetId = "hero" | "tasks" | "announcements" | "teams";

interface WidgetConfig {
  id: WidgetId;
  component: React.ReactNode;
}

const DraggableWidget = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <div className="bg-white rounded-lg shadow-md border p-1.5 hover:bg-gray-50">
          <GripVertical size={20} className="text-gray-400" />
        </div>
      </div>
      {children}
    </div>
  );
};

const TasksPriorities = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('upcoming');

  const { data, isLoading, isError, error } = useTasksQuery(activeFilter);
  console.log('data', data);

  return (<>
    <div className="rounded-xl border bg-white p-5 h-[500px] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Tasks Priorities</h3>
          <p className="text-sm text-gray-500">
            Team tasks sorted by priority
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => setActiveFilter('upcoming')}
          variant={activeFilter === 'upcoming' ? "violet" : "secondary"}
          size={'sm'}
        >
          {data?.meta.upcoming || 0} Upcoming
        </Button>
        <Button
          size={'sm'}
          variant={activeFilter === 'overdue' ? "violet" : "secondary"}
          onClick={() => setActiveFilter('overdue')}
        >
          {data?.meta.overdue || 0} Overdue
        </Button>
        <Button
          size={'sm'}
          variant={activeFilter === 'completed' ? "violet" : "secondary"}
          onClick={() => setActiveFilter('completed')}

        >
          {data?.meta.completed || 0} Completed
        </Button>
      </div>
      {isLoading ? (
        <div className="mt-4 space-y-4 overflow-y-auto flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="h-4 w-4 bg-gray-200 rounded mt-0.5" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) :
        <ul className="mt-4 space-y-4 overflow-y-auto flex-1">
          {!data?.data || data.data.length === 0 ? (
            <li className="py-8 text-center text-sm text-gray-500">
              No {activeFilter} tasks
            </li>
          ) :
            <>
              {data.data.map(task => (
                <li key={task.id} className="">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="shrink-0" />
                    <Link to={`/task/${task.id}`} className="text-md font-medium">
                      {task.title}
                    </Link>
                  </div>

                  <div className="mt-2 ml-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      {task.dueAt && <p className="text-sm text-gray-500">
                        {formatDate(task.dueAt)}
                      </p>}


                      {task?.tags && task.tags.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Tag size={16} />
                          <div className="flex gap-2 flex-wrap">
                            {task.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded text-xs bg-gray-100 uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Tag size={16} />
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100">
                            No Tag
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </>
          }
        </ul>}
    </div>
  </>
  );
};


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

const MyTeams = () => {
  const { data: teams, isLoading, isError, error } = useTeamsQuery();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleTeamModalOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };


  const handleTeamSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">My Teams</h3>
            <p className="text-sm text-gray-500">Teams with assigned tasks</p>
          </div>
          <button className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600">
            + Team
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border p-4 text-center"
            >
              <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-200" />
              <div className="mx-auto mb-1 h-4 w-20 rounded bg-gray-200" />
              <div className="mx-auto h-3 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorAlert message={error.message} />
  }

  return (<>
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">My Teams</h3>
          <p className="text-sm text-gray-500">
            Teams with assigned tasks
          </p>
        </div>

        <Button variant='soft' onClick={() => setOpen(true)}>
          + Team
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {!!teams && teams.map((team) => (
          <div
            key={team.id}
            className="rounded-lg border p-4 text-center"
          >
            <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center text-sm font-medium mx-auto mb-2">
              {team.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <p className="text-sm font-medium">{team.name}</p>
            <p className="text-xs text-gray-500">
              {team.users.length ?? 0} Members
            </p>
          </div>
        ))}
      </div>
    </div>
    <TeamModal
      open={open}
      onOpenChange={handleTeamModalOpenChange}
      onSaved={handleTeamSaved}
    />
  </>
  );
};


export default function Home() {
  const defaultOrder: WidgetId[] = ["hero", "tasks", "announcements", "teams"];

  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() => {
    const saved = localStorage.getItem("dashboardWidgetOrder");
    return saved ? JSON.parse(saved) : defaultOrder;
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("dashboardWidgetOrder", JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id as WidgetId);
        const newIndex = items.indexOf(over.id as WidgetId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const widgets: Record<WidgetId, React.ReactNode> = {
    hero: <HeroCard />,
    tasks: <TasksPriorities />,
    announcements: <Announcements />,
    teams: <MyTeams />,
  };


  return (
    <div className="min-h-screen p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={widgetOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {widgetOrder.map((widgetId, index) => {
              const nextWidget = widgetOrder[index + 1];
              const prevWidget = widgetOrder[index - 1];

              if (
                (widgetId === 'tasks' && nextWidget === 'announcements') ||
                (widgetId === 'announcements' && nextWidget === 'tasks')
              ) {
                return (
                  <div key={`grid-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DraggableWidget id={widgetId}>
                      {widgets[widgetId]}
                    </DraggableWidget>
                    <DraggableWidget id={nextWidget}>
                      {widgets[nextWidget]}
                    </DraggableWidget>
                  </div>
                );
              }

              if (
                (widgetId === 'announcements' && prevWidget === 'tasks') ||
                (widgetId === 'tasks' && prevWidget === 'announcements')
              ) {
                return null;
              }

              if (widgetId === 'tasks' || widgetId === 'announcements') {
                return (
                  <div key={widgetId} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DraggableWidget id={widgetId}>
                      {widgets[widgetId]}
                    </DraggableWidget>
                  </div>
                );
              }
              return (
                <DraggableWidget key={widgetId} id={widgetId}>
                  {widgets[widgetId]}
                </DraggableWidget>
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80">
              {widgets[activeId as WidgetId]}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}