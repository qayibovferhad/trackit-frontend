import {
  CheckCircle2,
  UserPlus,
  CheckSquare,
  MessageSquare,
  Megaphone,
  Users,
  LogIn,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NotificationItem, NotificationType } from "../types";
import { Link } from "react-router-dom";
import { PATHS } from "@/shared/constants/routes";
import { timeAgo } from "@/shared/utils/date";

function pickIcon(t: NotificationType) {
  const cls = "h-4 w-4";
  switch (t) {
    case "TEAM_INVITE":
      return <UserPlus className={cls} />;
    case "ANNOUNCEMENT_CREATED":
      return <Megaphone className={cls} />;
    case "TASK_ASSIGNED":
      return <CheckSquare className={cls} />;
    case "TASK_COMPLETED":
      return <CheckCircle2 className={cls} />;
    case "COMMENT_ADDED":
      return <MessageSquare className={cls} />;
    case "TEAM_MEMBER_JOINED":
      return <Users className={cls} />;
    case "JOIN_REQUEST_RECEIVED":
      return <LogIn className={cls} />;
    case "JOIN_REQUEST_ACCEPTED":
      return <Users className={cls} />;
    case "ANNOUNCEMENT_UPDATED":
      return <Megaphone className={cls} />;
    case "GROUP_CREATED":
      return <MessagesSquare className={cls} />;
    default:
      return <CheckCircle2 className={cls} />;
  }
}

function badgeBg(t: NotificationType) {
  switch (t) {
    case "TEAM_INVITE":
      return "bg-indigo-100 text-indigo-700";
    case "ANNOUNCEMENT_CREATED":
      return "bg-violet-100 text-violet-700";
    case "TASK_ASSIGNED":
      return "bg-sky-100 text-sky-700";
    case "TASK_COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "COMMENT_ADDED":
      return "bg-amber-100 text-amber-700";
    case "TEAM_MEMBER_JOINED":
      return "bg-emerald-100 text-emerald-700";
    case "JOIN_REQUEST_RECEIVED":
      return "bg-orange-100 text-orange-700";
    case "JOIN_REQUEST_ACCEPTED":
      return "bg-indigo-100 text-indigo-700";
    case "ANNOUNCEMENT_UPDATED":
      return "bg-violet-100 text-violet-700";
    case "GROUP_CREATED":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatNotificationContent(item: NotificationItem) {
  const { title, actorName } = item.payload;

  switch (item.type) {
    case "TEAM_INVITE":
      return {
        title: `${actorName} invited you to ${title}`,
        description: (
          <Link to={PATHS.NOTIFICATIONS} className="hover:text-indigo-800">
            Click to accept or view the invite
          </Link>
        ),
      };
    case "ANNOUNCEMENT_CREATED":
      return {
        title: `New announcement: ${title}`,
        description: `Posted by ${actorName}`,
      };
    case "TASK_ASSIGNED":
      return {
        title: `You have been assigned to "${title}"`,
        description: `By ${actorName}`,
      };
    case "TASK_COMPLETED":
      return {
        title: `Task completed: "${title}"`,
        description: `By ${actorName}`,
      };
    case "COMMENT_ADDED":
      return {
        title: `New comment on "${title}"`,
        description: `By ${actorName}`,
      };
    case "TEAM_MEMBER_JOINED":
      return {
        title: `${actorName} joined ${title}`,
        description: `New team member`,
      };
    case "JOIN_REQUEST_RECEIVED":
      return {
        title: `${actorName} wants to join ${title}`,
        description: (
          <Link to={PATHS.NOTIFICATIONS} className="hover:text-indigo-800">
            Click to accept or decline
          </Link>
        ),
      };
    case "JOIN_REQUEST_ACCEPTED":
      return {
        title: `Your request to join ${title} was accepted`,
        description: `By ${actorName}`,
      };
    case "ANNOUNCEMENT_UPDATED":
      return {
        title: `Announcement updated: ${title}`,
        description: `By ${actorName}`,
      };
    case "GROUP_CREATED":
      return {
        title: `${actorName} added you to "${title}"`,
        description: `New group conversation`,
      };
    default:
      return {
        title: title || "Notification",
        description: actorName,
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
