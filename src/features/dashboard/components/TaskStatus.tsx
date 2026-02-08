import { getTaskStatusStats } from "@/features/tasks/services/tasks.service";
import { useQuery } from "@tanstack/react-query";
import { Cell, Pie, ResponsiveContainer, Tooltip,PieChart } from "recharts";

export default function TaskStatusWidget() {
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