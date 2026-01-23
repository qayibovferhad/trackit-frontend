import { useUserStore } from "@/stores/userStore";
import { Button } from "../ui/button";
import { AtSign, Briefcase, CalendarDays, Mail } from "lucide-react";
import { useUserStatsQuery } from "../hooks/useUserStats";


type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const StatItem = ({ icon, label, value }: StatItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-300 text-violet-500">
        {icon}
      </div>
      <div>
        <p className="text-md text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};


export default function HeroCard (){
  const {user} = useUserStore()

    const { data: stats, isLoading, isError, error, refetch } = useUserStatsQuery(user?.id);

    console.log(stats,'stats');
    
  return (
    <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Hi {user?.name}, You are almost done.
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please complete few steps to setup your account completely.
          </p>
        </div>

        <Button variant={'violet'}>
          Setup Account
          <span className="text-lg">›</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-gray-200" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <StatItem
          icon={<Mail size={21} />}
          label="Completed Tasks"
          value="10.2K"
        />
        <StatItem
          icon={<AtSign size={21} />}
          label="Assigned Tasks"
          value="3.4K"
        />
        <StatItem
          icon={<Briefcase size={21} />}
          label="All Boards"
          value="450"
        />
        <StatItem
          icon={<CalendarDays size={18} />}
          label="Scheduled Tasks"
          value="23"
        />
      </div>
    </div>
  );
};