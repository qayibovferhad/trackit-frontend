export type NotificationType =
  | "TEAM_INVITE"
  | "ANNOUNCEMENT_CREATED"
  | "ANNOUNCEMENT_UPDATED"
  | "TASK_ASSIGNED"
  | "TASK_COMPLETED"
  | "COMMENT_ADDED"
  | "TEAM_MEMBER_JOINED"
  | "JOIN_REQUEST_RECEIVED"
  | "JOIN_REQUEST_ACCEPTED"
  | "GROUP_CREATED";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  createdAt: string; // ISO
  readAt?: string | null;
  href?: string;
  payload: {
    referenceId: string;
    referenceType: "team" | "task" | "announcement" | "comment";
    title: string;
    actorName: string;
    token?: string;
    role?: string;
  };
};
