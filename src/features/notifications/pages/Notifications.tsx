import { useEffect } from "react";
import type { NotificationItem } from "../types";
import NotificationRow from "../components/NotificationRow";
const mock: NotificationItem[] = [
  {
    id: "1",
    type: "TEAM_TASK_COMPLETED",
    title: "Team Task Completed",
    description: "Johnson complete Development team's all tasks",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "JOIN_REQUEST",
    title: "Join Request",
    description: "Williamson requested to join in Design team",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 saat önce
  },
  {
    id: "3",
    type: "TEAM_REQUEST_ACCEPTED",
    title: "Accepted Team Request",
    description: "Olivia accepted UI/UX Team's request",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "MONTHLY_REPORT",
    title: "Your Monthly Report",
    description: "We have shared your monthly activities report in PDF format",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "MENTION_TASK",
    title: "Mentioned in Task",
    description: "Elizabeth mentioned you in Samantha's sub task",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    type: "TEAM_TASK_COMPLETED",
    title: "Team Task Completed",
    description: "You completed Marketing team's task",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    type: "WEEKLY_REPORT",
    title: "Your Weekly Report",
    description: "Johnson complete Development team's all tasks",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    type: "MENTION_TEAM",
    title: "Mentioned in Team",
    description: "Ryan mentioned you in Design team's sub task",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function Notifications() {
  const items = mock;

  useEffect(() => {
    document.title = "Notification";
  }, []);

  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-3xl rounded-xl border bg-white p-0 shadow-sm">
        <div className="border-b p-4">
          <div className="text-base font-semibold">Notifications</div>
          <div className="text-sm text-muted-foreground">
            You can find all settings here.
          </div>
        </div>

        <ul className="divide-y">
          {items.map((n) => (
            <NotificationRow key={n.id} item={n} />
          ))}
        </ul>
      </div>
    </div>
  );
}
