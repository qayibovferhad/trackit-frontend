import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { fetchAnnouncements } from "@/features/announcements/services/announcements.service";
import { formatDate } from "@/shared/utils/date";
import UserAvatar from "@/shared/components/UserAvatar";
import { Link } from "react-router-dom";

export default function AnnouncementsWidget() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });

  const recent = data.slice(0, 5);

  return (
    <div className="rounded-xl border bg-white p-5 h-[500px] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Announcements</h3>
          <p className="text-sm text-gray-500">From personal and team project</p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-4 overflow-y-auto flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <p className="mt-4 text-center text-sm text-gray-500 flex-1">
          No announcements yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-4 overflow-y-auto flex-1">
          {recent.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <Link to={`/profile/${item.author.username}`} className="shrink-0">
                <UserAvatar name={item.author.name} src={item.author.profileImage} />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(item.createdAt)}
                  </span>
                  <span>
                    From{" "}
                    <Link
                      to={`/profile/${item.author.username}`}
                      className="text-violet-600 font-medium hover:underline"
                    >
                      {item.author.name ?? item.author.username ?? "Unknown"}
                    </Link>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
