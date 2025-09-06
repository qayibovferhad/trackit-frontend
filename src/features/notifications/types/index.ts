export type NotificationType =
  | "TEAM_TASK_COMPLETED"
  | "JOIN_REQUEST"
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
};
