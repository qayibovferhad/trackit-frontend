import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberPermissions } from "../services/teams.service";
import type { MemberPermissions, TeamMember } from "../types";
import { Modal } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import UserAvatar from "@/shared/components/UserAvatar";
import { DEFAULT_MEMBER_PERMISSIONS } from "../constants";

const PERMISSION_GROUPS = [
  {
    label: "Board",
    items: [
      { key: "canCreateBoard", label: "Can create boards" },
      { key: "canDeleteBoard", label: "Can delete boards" },
    ],
  },
  {
    label: "Column",
    items: [
      { key: "canCreateColumn", label: "Can create columns" },
      { key: "canEditColumn", label: "Can edit columns" },
      { key: "canDeleteColumn", label: "Can delete columns" },
    ],
  },
  {
    label: "Task",
    items: [
      { key: "canCreateTask", label: "Can create tasks" },
      { key: "canDeleteTask", label: "Can delete tasks" },
      { key: "canAssignTask", label: "Can assign tasks" },
    ],
  },
  {
    label: "Team",
    items: [
      { key: "canInviteMembers", label: "Can invite members" },
      { key: "canRemoveMembers", label: "Can remove members" },
    ],
  },
] as const;

type PermKey = keyof MemberPermissions;

export default function MemberPermissionsModal({
  open,
  onOpenChange,
  member,
  teamId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  member: TeamMember;
  teamId: string;
}) {
  const queryClient = useQueryClient();
  const [perms, setPerms] = useState<MemberPermissions>(
    member.permissions ?? { ...DEFAULT_MEMBER_PERMISSIONS }
  );

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateMemberPermissions(teamId, member.id, perms),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      onOpenChange(false);
    },
  });

  const toggle = (key: PermKey) => {
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Manage Permissions"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="soft" onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
        <UserAvatar
          name={member.user.username ?? member.user.email}
          src={member.user.profileImage}
          size="md"
        />
        <div>
          <p className="text-sm font-medium">
            {member.user.username ?? member.user.name ?? member.user.email}
          </p>
          <p className="text-xs text-muted-foreground">{member.user.email}</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {group.label}
            </p>
            <div className="space-y-2">
              {group.items.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <span className="text-sm">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={perms[key as PermKey]}
                    onClick={() => toggle(key as PermKey)}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                      perms[key as PermKey] ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        perms[key as PermKey] ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
