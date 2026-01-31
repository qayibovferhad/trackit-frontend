import { useState } from "react";
import type { WidgetId } from "../types";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import HeroCard from "@/shared/components/HeroCard";
import DraggableWidget from "@/shared/components/DraggableWidget";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { useQuery } from "@tanstack/react-query";
import { getDoneTaskStats } from "@/features/tasks/services/tasks.service";
const widgetsLocalKey = 'dashboardWidgetOrder'


const DoneTasksWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["doneTasks"],
    queryFn: getDoneTaskStats,
  });

  if (isLoading) {
    return <div className="h-[80px] bg-gray-100 animate-pulse rounded-md" />;
  }

  if (!data) return null;

  // 🔥 Recharts üçün uyğun format
  const chartData = data.days.map((day) => {
    const date = new Date(day.date);
    const month = date.getMonth() + 1; // 0-11
    const dayOfMonth = date.getDate();
    return {
      name: `${month}/${dayOfMonth}`, // MM/DD
      value: day.count,
    };
  });

  console.log(chartData, 'chartData');


  return (
    <div>
      {/* Header */}
      <p className="text-sm text-gray-500">Total tasks done</p>
      <p className="text-2xl font-bold">{data.total}</p>
      <p className="text-xs text-gray-400 mb-2">Last 7 days</p>

      {/* Chart */}
      <ResponsiveContainer width="50%" height={200}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Dashboard() {
  const defaultOrder: WidgetId[] = ["hero", "widget"];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() => {
    const saved = localStorage.getItem(widgetsLocalKey);
    return saved ? JSON.parse(saved) : defaultOrder;
  });

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
    widget: <DoneTasksWidget />
  };

  return <div className="min-h-screen p-6">
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
}


