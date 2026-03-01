import { useEffect, useState } from "react";
import NotificationRow from "../components/NotificationRow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyNotifications, markAllNotificationsRead } from "../services/notifications.service";

const LIMIT = 10;

export default function Notifications() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Notification";
  }, []);

  const { data } = useQuery({
    queryKey: ["my-notifications", page],
    queryFn: () => fetchMyNotifications(page, LIMIT),
  });

  const notifications = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { mutate: markAllRead } = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  useEffect(() => {
    if (notifications.some((n) => !n.readAt)) {
      markAllRead();
    }
  }, [notifications]);

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
          {notifications.map((n) => (
            <NotificationRow key={n.id} item={n} />
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
