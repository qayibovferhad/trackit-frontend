import {
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  FileText,
  AtSign,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NotificationItem, NotificationType } from "../types";
import { Link } from "react-router-dom";
import { PATHS } from "@/shared/constants/routes";
import { timeAgo } from "@/shared/utils/date";

function pickIcon(t: NotificationType) {
  const cls = "h-4 w-4";
  switch (t) {
    case "TEAM_TASK_COMPLETED":
      return <CheckSquare className={cls} />;
    case "TEAM_INVITE":
      return <UserPlus className={cls} />;
    case "TEAM_REQUEST_ACCEPTED":
      return <ShieldCheck className={cls} />;
    case "MONTHLY_REPORT":
      return <FileText className={cls} />;
    case "MENTION_TASK":
      return <AtSign className={cls} />;
    case "WEEKLY_REPORT":
      return <FileText className={cls} />;
    case "MENTION_TEAM":
      return <MessageSquare className={cls} />;
    default:
      return <CheckCircle2 className={cls} />;
  }
}

function badgeBg(t: NotificationType) {
  switch (t) {
    case "TEAM_TASK_COMPLETED":
      return "bg-violet-100 text-violet-700";
    case "TEAM_INVITE":
      return "bg-indigo-100 text-indigo-700";
    case "TEAM_REQUEST_ACCEPTED":
      return "bg-emerald-100 text-emerald-700";
    case "MONTHLY_REPORT":
      return "bg-amber-100 text-amber-700";
    case "MENTION_TASK":
      return "bg-sky-100 text-sky-700";
    case "WEEKLY_REPORT":
      return "bg-fuchsia-100 text-fuchsia-700";
    case "MENTION_TEAM":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatNotificationContent(item: NotificationItem) {
  switch (item.type) {
    case "TEAM_INVITE":
      return {
        title: `${item.payload.invitedByName || ""} invited you to ${
          item.payload.teamName
        }`,
        description: (
          <Link to={PATHS.NOTIFICATIONS} className="hover:text-indigo-800">
            Click to accept or view the invite
          </Link>
        ),
      };

    default:
      return {
        title: item.title || "Notification",
        description: item.description,
      };
  }
}

export default function NotificationRow({ item }: { item: NotificationItem }) {
  const unread = !item.readAt;
  const icon = pickIcon(item.type);
  const time = timeAgo(item.createdAt);
  const { title, description } = formatNotificationContent(item);

  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        unread ? "bg-white" : "bg-white"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          badgeBg(item.type)
        )}
        aria-hidden
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{title}</div>
            {description && (
              <div className="truncate text-sm text-muted-foreground">
                {description}
              </div>
            )}
          </div>

          <div className="shrink-0 text-xs text-muted-foreground">{time}</div>
        </div>
      </div>
    </li>
  );
}
