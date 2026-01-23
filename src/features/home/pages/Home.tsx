import HeroCard from "@/shared/components/HeroCard";
import { Button } from "@/shared/ui/button";
import { useUserStore } from "@/stores/userStore";
import { AtSign,  Briefcase,  CalendarDays, Mail } from "lucide-react";


const TasksPriorities = () => {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Tasks Priorities</h3>
          <p className="text-sm text-gray-500">
            Team tasks sorted by priority
          </p>
        </div>

        <button className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600">
          + Task
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600">
          4 Upcoming
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
          2 Overdue
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
          0 Completed
        </span>
      </div>

      <ul className="mt-4 space-y-4">
        <li className="flex items-start gap-3">
          <input type="checkbox" />
          <div>
            <p className="text-sm font-medium">
              Complete UX for new landing page
            </p>
            <p className="text-xs text-gray-500">30 Aug 2022 · UX</p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <input type="checkbox" />
          <div>
            <p className="text-sm font-medium">
              Hire Web3 Developer to finish web3 related functions
            </p>
            <p className="text-xs text-gray-500">22 Aug 2022 · No Tag</p>
          </div>
        </li>
      </ul>
    </div>
  );
};


const Announcements = () => {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h3 className="font-semibold">Announcements</h3>
      <p className="text-sm text-gray-500">From personal and team project</p>

      <ul className="mt-4 space-y-4">
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

const teams = [
  { name: "John's Team", members: 2 },
  { name: "UX designers", members: 45 },
  { name: "Juliana's Team", members: 5 },
  { name: "Senior Developers", members: 23 },
  { name: "Anderson's Team", members: 3 },
];

const MyTeams = () => {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">My Teams</h3>
          <p className="text-sm text-gray-500">
            Teams with assigned tasks
          </p>
        </div>

        <button className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600">
          + Team
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {teams.map((team) => (
          <div
            key={team.name}
            className="rounded-lg border p-4 text-center"
          >
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-200" />
            <p className="text-sm font-medium">{team.name}</p>
            <p className="text-xs text-gray-500">
              {team.members} Members
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home(){
   return (
    <div className="min-h-screen p-6">
      <div className="mt-2 space-y-6">
        <HeroCard />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TasksPriorities />
          </div>

          <Announcements />
        </div>

        <MyTeams />
      </div>
    </div>
  );
}