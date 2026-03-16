import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamMembers, removeMember } from "../services/teams.service";
import type { Team } from "../types";
import { Modal } from "@/shared/ui/modal";
import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { Settings2, UserMinus } from "lucide-react";
import MemberPermissionsModal from "./MemberPermissionsModal";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useTeamPermissions } from "../hooks/useTeamPermissions";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/error";

export default function TeamMembersModal({
  open,
  onOpenChange,
  team,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  team: Team;
}) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { canRemoveMembers } = useTeamPermissions(team.id);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team-members", team.id],
    queryFn: () => getTeamMembers(team.id, ""),
    enabled: open,
  });

  const { mutateAsync: doRemove, isPending: isRemoving } = useMutation({
    mutationFn: (memberId: string) => removeMember(team.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", team.id] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setRemovingMemberId(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const selectedMember = selectedMemberId
    ? members.find((m) => m.id === selectedMemberId) ?? null
    : null;

  const removingMember = removingMemberId
    ? members.find((m) => m.id === removingMemberId) ?? null
    : null;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={`Members — ${team.name}`}
        size="md"
      >
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
          )}
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={member.user.username ?? member.user.email}
                  src={member.user.profileImage}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium">
                    {member.user.username ?? member.user.name ?? member.user.email}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      member.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {member.role === "admin" ? "Admin" : "Member"}
                  </span>
                </div>
              </div>

              {member.role !== "admin" && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  {canRemoveMembers && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setRemovingMemberId(member.id)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {selectedMember && (
        <MemberPermissionsModal
          open={!!selectedMember}
          onOpenChange={(v) => { if (!v) setSelectedMemberId(null); }}
          member={selectedMember}
          teamId={team.id}
        />
      )}

      {removingMember && (
        <ConfirmModal
          open={!!removingMember}
          onOpenChange={(v) => { if (!v) setRemovingMemberId(null); }}
          title="Remove member?"
          description={`"${removingMember.user.username ?? removingMember.user.email}" will be removed from ${team.name}.`}
          confirmText="Remove"
          cancelText="Cancel"
          isLoading={isRemoving}
          onConfirm={() => doRemove(removingMember.id)}
        />
      )}
    </>
  );
}
