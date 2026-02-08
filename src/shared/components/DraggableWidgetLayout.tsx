import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableWidget from "@/shared/components/DraggableWidget";

export interface WidgetConfig<T extends string> {
  id: T;
  component: React.ReactNode;
  fullWidth?: boolean;
}

interface DraggableWidgetLayoutProps<T extends string> {
  widgets: WidgetConfig<T>[];
  defaultOrder: T[];
  localStorageKey: string;
  className?: string;
}

export default function DraggableWidgetLayout<T extends string>({
  widgets,
  defaultOrder,
  localStorageKey,
  className = "min-h-screen",
}: DraggableWidgetLayoutProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [widgetOrder, setWidgetOrder] = useState<T[]>(() => {
    const saved = localStorage.getItem(localStorageKey);
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
        const oldIndex = items.indexOf(active.id as T);
        const newIndex = items.indexOf(over.id as T);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(localStorageKey, JSON.stringify(newOrder));
        return newOrder;
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const widgetMap: Record<string, React.ReactNode> = {};
  const widgetConfigMap: Record<string, WidgetConfig<T>> = {};
  
  widgets.forEach((widget) => {
    widgetMap[widget.id] = widget.component;
    widgetConfigMap[widget.id] = widget;
  });

  const renderWidgets = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < widgetOrder.length) {
      const currentWidgetId = widgetOrder[i];
      const currentConfig = widgetConfigMap[currentWidgetId];

      if (currentConfig?.fullWidth) {
        elements.push(
          <DraggableWidget key={currentWidgetId} id={currentWidgetId}>
            {widgetMap[currentWidgetId]}
          </DraggableWidget>
        );
        i++;
      } else {
        const nextWidgetId = widgetOrder[i + 1];
        const nextConfig = widgetConfigMap[nextWidgetId];

        if (nextWidgetId && !nextConfig?.fullWidth) {
          elements.push(
            <div key={`grid-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DraggableWidget id={currentWidgetId}>
                {widgetMap[currentWidgetId]}
              </DraggableWidget>
              <DraggableWidget id={nextWidgetId}>
                {widgetMap[nextWidgetId]}
              </DraggableWidget>
            </div>
          );
          i += 2;
        } else {
          elements.push(
            <DraggableWidget key={currentWidgetId} id={currentWidgetId}>
              {widgetMap[currentWidgetId]}
            </DraggableWidget>
          );
          i++;
        }
      }
    }

    return elements;
  };

  return (
    <div className={className}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">{renderWidgets()}</div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80">{widgetMap[activeId as T]}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}