import { Button } from "@/shared/ui/button";
import TeamCard from "../components/TeamCard";
import AddTeamModal from "../components/AddTeamModal";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyInvitesCount, fetchTeams } from "../services/teams.service";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import InvitesModal from "../components/InvitesModal";

export default function Teams() {
  const [open, setOpen] = useState(false);
  const [invitesOpen, setInvitesOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: teams,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 10_000,
    gcTime: 30 * 60_000,
  });

  const { data: invitesCount = 0 } = useQuery({
    queryKey: ["my-invites-count"],
    queryFn: fetchMyInvitesCount,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const handleTeamCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    setOpen(false);
  };

  const handleInvitesAction = () => {
    queryClient.invalidateQueries({ queryKey: ["my-invites-count"] });
  };
  return (
    <>
      <div className="px-6 pb-10">
        <div className="mb-3 flex items-center gap-3 justify-between">
          <div>
            <h1 className="text-lg font-semibold">My Teams</h1>
            <p className="text-sm text-muted-foreground">
              {teams?.length ?? 0} Total teams are added
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setInvitesOpen(true)}>
              Invites
              {invitesCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs text-white">
                  {invitesCount}
                </span>
              )}
            </Button>

            <Button variant="soft" onClick={() => setOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 mr-2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Team
            </Button>
          </div>
        </div>
        {isLoading && <p>Loading teams...</p>}
        {isError && <ErrorAlert message="Failed to load teams" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams?.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
      <AddTeamModal
        open={open}
        onOpenChange={setOpen}
        onTeamCreated={handleTeamCreated}
      />
      <InvitesModal open={invitesOpen} onOpenChange={setInvitesOpen} />
    </>
  );
}
