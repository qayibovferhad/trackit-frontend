import { useUserStore } from "@/stores/userStore";
import type { User } from "@/features/auth/types/auth.type";
import type { Team } from "../types";
import { useTeamsQuery } from "./useTeams";
import { DEFAULT_MEMBER_PERMISSIONS } from "../constants";

export interface TeamPermissions {
  // Team management
  canCreateTeam: boolean;
  canEditTeam: boolean;
  canDeleteTeam: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canCreateBoard: boolean;
  canDeleteBoard: boolean;
  canCreateColumn: boolean;
  canEditColumn: boolean;
  canDeleteColumn: boolean;
  canCreateTask: boolean;
  canDeleteTask: boolean;
  canAssignTask: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

function compute(user: User | null, team: Team | null | undefined): TeamPermissions {
  const member = team?.users.find((m) => m.userId === user?.id);
  const isCompany = user?.accountType === "company";
  const isAdmin = !!(isCompany && member?.role === "admin");
  const isMember = !!member;

  if (isAdmin) {
    return {
      canCreateTeam: true, canEditTeam: true, canDeleteTeam: true,
      canInviteMembers: true, canRemoveMembers: true,
      canCreateBoard: true, canDeleteBoard: true,
      canCreateColumn: true, canEditColumn: true, canDeleteColumn: true,
      canCreateTask: true, canDeleteTask: true, canAssignTask: true,
      isAdmin: true, isMember: true,
    };
  }

  const p = member?.permissions ?? DEFAULT_MEMBER_PERMISSIONS;

  return {
    canCreateTeam: !!isCompany,
    canEditTeam: false,
    canDeleteTeam: false,
    canInviteMembers: p.canInviteMembers,
    canRemoveMembers: p.canRemoveMembers,
    canCreateBoard: p.canCreateBoard,
    canDeleteBoard: p.canDeleteBoard,
    canCreateColumn: p.canCreateColumn,
    canEditColumn: p.canEditColumn,
    canDeleteColumn: p.canDeleteColumn,
    canCreateTask: p.canCreateTask,
    canDeleteTask: p.canDeleteTask,
    canAssignTask: p.canAssignTask,
    isAdmin: false,
    isMember,
  };
}

export function getTeamPermissions(
  user: User | null,
  team: Team | null | undefined
): TeamPermissions {
  console.log(compute(user, team),'compute(user, team)');
  
  return compute(user, team);
}

export function useTeamPermissions(teamId?: string): TeamPermissions {
  const user = useUserStore((s) => s.user);
  const { data: teams } = useTeamsQuery();
  const team = teamId ? (teams?.find((t) => t.id === teamId) ?? null) : null;
  return compute(user, team);
}
