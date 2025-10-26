import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import {
  useQuery,
} from "@tanstack/react-query";
import {
  fetchMyAdminTeamsForInvite,
} from "../services/teams.service";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { Users } from "lucide-react";

type InviteTeamModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId:string
};

export default function InviteTeamModal({
  open,
  onOpenChange,
  userId
}: InviteTeamModalProps) {
  const { data: teams=[],isLoading,isError } = useQuery({
    queryKey: ["my-admin-teams-for-invite"],
    queryFn: ()=>fetchMyAdminTeamsForInvite(userId),
    staleTime: 10_000,
    gcTime: 30 * 60_000,
    enabled:!!userId
  });


  console.log(teams,'teams');
  
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
            {teams && teams.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                <div>
                      <h3 className="text-sm font-medium text-gray-900">{t.name}</h3>
                      <p className="text-xs text-gray-500">
                        <Users className="w-3 h-3 inline mr-0.5" />
                        {t?.users?.length} Members
                      </p>
                    </div>
                </div>
                    <Button>Invite</Button>

              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

