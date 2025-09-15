import { useEffect } from "react";
import NotificationRow from "../components/NotificationRow";
import { useQuery } from "@tanstack/react-query";
import { fetchMyNotifications } from "../services/notifications.service";

export default function Notifications() {
  useEffect(() => {
    document.title = "Notification";
  }, []);

  const { data = [] } = useQuery({
    queryKey: ["my-notifications"],
    queryFn: fetchMyNotifications,
  });

  console.log("TEAM_INVITE", data);

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
          {data.map((n) => (
            <NotificationRow key={n.id} item={n} />
          ))}
        </ul>
      </div>
    </div>
  );
}
