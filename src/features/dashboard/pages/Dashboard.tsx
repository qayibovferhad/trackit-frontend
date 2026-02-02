import { useState } from "react";
import type { WidgetId } from "../types";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import HeroCard from "@/shared/components/HeroCard";
import DraggableWidget from "@/shared/components/DraggableWidget";
import {  ResponsiveContainer, XAxis, YAxis, Tooltip,PieChart, Pie, Cell , AreaChart, Area,  CartesianGrid  } from 'recharts'
import { useQuery } from "@tanstack/react-query";
import { getDoneTaskStats, getTaskStatusStats } from "@/features/tasks/services/tasks.service";
const widgetsLocalKey = 'dashboardWidgetOrder'


const TeamsPerformanceWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["teamsPerformance"],
    queryFn: ()=>[], 
  });

  if (isLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-md" />;
  }

  const mockData = {
    teams: [
      'Development team',
      'Digi Marketing team',
      'Product design team',
      'Growth team'
    ],
    monthlyData: [
      { month: 'Jan', value: 20 },
      { month: 'Feb', value: 35 },
      { month: 'Mar', value: 25 },
      { month: 'Apr', value: 45 },
      { month: 'May', value: 40 },
      { month: 'Jun', value: 50 },
      { month: 'Jul', value: 35 },
      { month: 'Aug', value: 30 },
      { month: 'Sep', value: 25 },
      { month: 'Oct', value: 35 },
      { month: 'Nov', value: 30 },
      { month: 'Dec', value: 45 },
    ]
  };

  const chartData = data?.monthlyData || mockData.monthlyData;
  const teams = data?.teams || mockData.teams;

  console.log(chartData,'chartData');
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">My Teams Performance</h3>
        <p className="text-sm text-gray-500">Teams with tasks graph analysis</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        <div className="space-y-3">
          {teams.map((team, index) => (
            <div 
              key={index}
              className="px-4 py-2 bg-gray-50 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {team}
            </div>
          ))}
        </div>

        <div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'Performance']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={{ fill: '#8B5CF6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const TaskStatusWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["taskStatus"],
    queryFn: getTaskStatusStats,
  });

  console.log('data',data);
  
  if (isLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-md" />;
  }

  const statusData = data?.statuses

  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {statusData && statusData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">Total Tasks done</h3>
        <p className="text-sm text-gray-500">Tasks Completed in last 7 days (Pie Chart)</p>
      </div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={163}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {statusData && statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value} tasks`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
        {renderLegend()}
      </div>
    </div>
  );
};

const DoneTasksWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["doneTasks"],
    queryFn: getDoneTaskStats,
  });

  if (isLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-md" />;
  }

  if (!data) return null;

   const chartData = data.days.map((day) => {
    const date = new Date(day.date);
    const dayOfMonth = date.getDate();
        const month = date.getMonth() + 1; 

    return {
      name: `${month}/${dayOfMonth}`,
      tasks: day.count,
    };
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">Total Tasks done</h3>
        <p className="text-sm text-gray-500">Tasks Completed in last 7 days</p>
      </div>

 <ResponsiveContainer width="100%" height={200}>
  <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
    <defs>
      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
      </linearGradient>
    </defs>
    
    <XAxis 
      dataKey="name" 
      tick={{ fontSize: 12, fill: '#6B7280' }}
      axisLine={{ stroke: '#E5E7EB' }}
      tickLine={false}
    />
    <YAxis 
      allowDecimals={false} 
      tick={{ fontSize: 12, fill: '#6B7280' }}
      axisLine={false}
      tickLine={false}
    />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: 'white', 
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        fontSize: '12px'
      }}
      formatter={(value) => [`${value} tasks`, 'Completed']}
    />
    <Area
      type="monotone"
      dataKey="tasks"
      stroke="#8B5CF6"
      strokeWidth={2}
      fill="url(#colorTasks)"
      dot={{ fill: '#8B5CF6', r: 3 }}
      activeDot={{ r: 5 }}
    />
  </AreaChart>
</ResponsiveContainer>
    </div>
  );
};

export default function Dashboard() {
  const defaultOrder: WidgetId[] = ["hero", "tasksDone", "taskStatus",'teamsPerformance'];
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
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(widgetsLocalKey, JSON.stringify(newOrder));
        return newOrder;
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const widgets: Record<WidgetId, React.ReactNode> = {
    hero: <HeroCard />,
    tasksDone: <DoneTasksWidget />,
    taskStatus: <TaskStatusWidget />,
    teamsPerformance: <TeamsPerformanceWidget /> 
  };

  const renderWidgets = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < widgetOrder.length) {
      const currentWidget = widgetOrder[i];

      if (currentWidget === "hero") {
        elements.push(
          <DraggableWidget key={currentWidget} id={currentWidget}>
            {widgets[currentWidget]}
          </DraggableWidget>
        );
        i++;
      } else {
        const nextWidget = widgetOrder[i + 1];
        
        if (nextWidget && nextWidget !== "hero") {
          elements.push(
            <div key={`grid-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DraggableWidget id={currentWidget}>
                {widgets[currentWidget]}
              </DraggableWidget>
              <DraggableWidget id={nextWidget}>
                {widgets[nextWidget]}
              </DraggableWidget>
            </div>
          );
          i += 2;
        } else {
          elements.push(
            <DraggableWidget key={currentWidget} id={currentWidget}>
              {widgets[currentWidget]}
            </DraggableWidget>
          );
          i++;
        }
      }
    }

    return elements;
  };

  return (
    <div className="min-h-screen">
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
            {renderWidgets()}
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