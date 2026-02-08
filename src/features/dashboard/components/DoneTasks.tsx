import { getDoneTaskStats } from "@/features/tasks/services/tasks.service";
import { useQuery } from "@tanstack/react-query";
import { Area, ResponsiveContainer, Tooltip, XAxis, YAxis,AreaChart } from "recharts";

export default function DoneTasksWidget() {
    const { data, isLoading } = useQuery({
        queryKey: ["doneTasks"],
        queryFn: getDoneTaskStats,
    });

    if (isLoading) {
        return <div className="h-[300px] bg-gray-100 animate-pulse rounded-md" />;
    }

    console.log('data',data);
    
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

    console.log(chartData,'chartData');
    
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
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
