import type { MemberPermissions } from "../types";

export const DEFAULT_MEMBER_PERMISSIONS: MemberPermissions = {
  canCreateBoard: false,
  canDeleteBoard: false,
  canCreateColumn: true,
  canEditColumn: false,
  canDeleteColumn: false,
  canCreateTask: true,
  canDeleteTask: false,
  canAssignTask: true,
  canInviteMembers: false,
  canRemoveMembers: false,
};