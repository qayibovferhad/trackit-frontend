import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchMyAdminTeamsForInvite,
  inviteUser,
} from "../services/teams.service";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { Users } from "lucide-react";
import { useState } from "react";

type InviteTeamModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string
};

export default function InviteTeamModal({
  open,
  onOpenChange,
  userId
}: InviteTeamModalProps) {
  const [invitedTeams, setInvitedTeams] = useState<string[]>([])
  const { data: teams = [], isLoading, isError } = useQuery({
    queryKey: ["my-admin-teams-for-invite"],
    queryFn: () => fetchMyAdminTeamsForInvite(userId),
    enabled: !!userId
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (teamId: string) => inviteUser(teamId, userId),
    onSuccess(_, teamId) {
      setInvitedTeams(prev => [...prev, teamId])
    }
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Invite Members">
      <div className="max-h-[440px] overflow-auto pr-1">
        {isLoading ? (
          <div className="p-3 text-sm text-muted-foreground">
            Loading teams...
          </div>
        ) : isError ? (
          <ErrorAlert message="Failed to load users." />
        ) : teams.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            No eligible team.
          </div>
        ) : (
          <ul className="divide-y">
            {teams && teams.map((team) => {
              const alreadyInvited = invitedTeams.includes(team.id);
              return <li key={team.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{team.name}</h3>
                    <p className="text-xs text-gray-500">
                      <Users className="w-3 h-3 inline mr-0.5" />
                      {team?.users?.length} Members
                    </p>
                  </div>
                </div>
                <Button disabled={alreadyInvited || isPending} onClick={() => mutate(team.id)}>
                  {alreadyInvited ? "Invited" : "Invite"}
                </Button>
              </li>
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}

