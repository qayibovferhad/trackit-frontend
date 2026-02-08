import { fetchMyAdminTeams, getMyTeamPerformance } from "@/features/teams/services/teams.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,AreaChart } from "recharts";

export default function TeamsPerformanceWidget ()  {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["userTeams"],
    queryFn: fetchMyAdminTeams,
  });

  useEffect(() => {
    if (teamsData && teamsData.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teamsData[0].id);
    }
  }, [teamsData, selectedTeamId]);

  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["teamPerformance", selectedTeamId],
    queryFn: () => selectedTeamId ? getMyTeamPerformance(selectedTeamId) : null,
    enabled: !!selectedTeamId,
  });

  if (teamsLoading || performanceLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-md" />;
  }

  if (!teamsData || teamsData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">My Teams Performance</h3>
          <p className="text-sm text-gray-500">Teams with tasks graph analysis</p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No teams found
        </div>
      </div>
    );
  }

  const chartData = performanceData?.monthlyData || [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">My Teams Performance</h3>
        <p className="text-sm text-gray-500">Teams with tasks graph analysis</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        <div className="space-y-3">
          {teamsData.map((team) => (
            <div 
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`px-4 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                selectedTeamId === team.id
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {team.name}
            </div>
          ))}
        </div>

        <div>
          {chartData.length > 0 ? (
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
                  domain={[0, 100]}
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
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              No performance data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};