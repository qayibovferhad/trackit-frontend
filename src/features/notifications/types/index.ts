export type NotificationType =
  | "TEAM_TASK_COMPLETED"
  | "TEAM_INVITE"
  | "TEAM_REQUEST_ACCEPTED"
  | "MONTHLY_REPORT"
  | "MENTION_TASK"
  | "WEEKLY_REPORT"
  | "MENTION_TEAM";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  createdAt: string; // ISO
  readAt?: string | null;
  href?: string;
  payload: {
    teamName: string;
    invitedByName: string;
    teamId: string;
  };
};
