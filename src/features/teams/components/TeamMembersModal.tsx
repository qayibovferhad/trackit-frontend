import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "../services/teams.service";
import type { Team } from "../types";
import { Modal } from "@/shared/ui/modal";
import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { Settings2 } from "lucide-react";
import MemberPermissionsModal from "./MemberPermissionsModal";

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

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team-members", team.id],
    queryFn: () => getTeamMembers(team.id, ""),
    enabled: open,
  });

  // Live reference — updates automatically when members refetches after permission save
  const selectedMember = selectedMemberId
    ? members.find((m) => m.id === selectedMemberId) ?? null
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedMemberId(member.id)}
                >
                  <Settings2 className="w-4 h-4" />
                </Button>
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
    </>
  );
}
