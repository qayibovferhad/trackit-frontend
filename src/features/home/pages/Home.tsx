import TeamModal from "@/features/teams/components/TeamModal";
import { useTeamsQuery } from "@/features/teams/hooks/useTeams";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import HeroCard from "@/shared/components/HeroCard";
import { Button } from "@/shared/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


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
  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
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