import { Button } from "@/shared/ui/button";
import TeamCard from "../components/TeamCard";
import TeamModal from "../components/TeamModal";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTeam,
  fetchMyInvitesCount,
} from "../services/teams.service";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import InvitesModal from "../components/InvitesModal";
import InviteUserModal from "../components/InviteUserModal";
import type { Team } from "../types";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import PageHeader from "@/layouts/AppLayout/components/PageHeader";
import { useTeamsQuery } from "../hooks/useTeams";

export default function Teams() {
  const [open, setOpen] = useState(false);
  const [invitesOpen, setInvitesOpen] = useState(false);
  const [invitesUserOpen, setInvitesUserOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const queryClient = useQueryClient();

  const {
    data: teams,
    isLoading,
    isError,
  } = useTeamsQuery()

  const { data: invitesCount = 0 } = useQuery({
    queryKey: ["my-invites-count"],
    queryFn: fetchMyInvitesCount,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const handleTeamSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    setOpen(false);
  };

  const handleInvitesAction = () => {
    queryClient.invalidateQueries({ queryKey: ["my-invites-count"] });
  };

  const { mutateAsync: removeTeam, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => deleteTeam(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      setConfirmOpen(false);
      setSelectedTeam(null);
    },
  });

  const handleConfirmDelete = async () => {
    if (!selectedTeam) return;
    await removeTeam(selectedTeam.id);
  };

  const handleTeamModalOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSelectedTeam(null);
  };
  const handleInviteUserModalOpenChange = (isOpen: boolean) => {
    setInvitesUserOpen(isOpen);
    if (!isOpen) setSelectedTeam(null);
  };

  const handleConfirmModalOpenChange = (isOpen: boolean) => {
    setConfirmOpen(isOpen);
    if (!isOpen) setSelectedTeam(null);
  };

  return (
    <>
      <div className="px-6 pb-10">
        <PageHeader
          title="My Teams"
          subtitle={`${teams?.length ?? 0} Total teams are added`}
          actions={
            <>
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
            </>
          }
        />
        {isLoading && <p>Loading teams...</p>}
        {isError && <ErrorAlert message="Failed to load teams" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams?.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onOpenInviteUserModal={() => {
                setSelectedTeam(team);
                setInvitesUserOpen(true);
              }}
              onRequestDelete={() => {
                setSelectedTeam(team);
                setConfirmOpen(true);
              }}
              onEditTeam={() => {
                setSelectedTeam(team);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      <TeamModal
        open={open}
        onOpenChange={handleTeamModalOpenChange}
        onSaved={handleTeamSaved}
        team={selectedTeam}
      />
      <InvitesModal
        open={invitesOpen}
        onOpenChange={setInvitesOpen}
        onInviteAction={handleInvitesAction}
      />
      {selectedTeam && (
        <InviteUserModal
          open={invitesUserOpen}
          onOpenChange={handleInviteUserModalOpenChange}
          teamId={selectedTeam.id}
        />
      )}
      {selectedTeam && (
        <ConfirmModal
          open={confirmOpen}
          onOpenChange={handleConfirmModalOpenChange}
          title="Delete this team?"
          description={`“${selectedTeam.name}” will be permanently deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
