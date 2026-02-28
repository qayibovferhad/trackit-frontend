import { CalendarDays, Edit2, Globe, MoreHorizontal, Trash2, Users } from "lucide-react";
import { formatDate } from "@/shared/utils/date";
import type { Announcement } from "../types";
import UserAvatar from "@/shared/components/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRow,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type Props = {
  item: Announcement;
  currentUserId: string;
  onDelete: (id: string) => void;
  onEdit: (item: Announcement) => void;
};

export default function AnnouncementCard({
  item,
  currentUserId,
  onDelete,
  onEdit,
}: Props) {
  const isOwn = item.authorId === currentUserId;
  const displayName = item.author.name ?? item.author.username ?? "Unknown";

  return (
    <li className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors">
      <UserAvatar name={item.author.name} src={item.author.profileImage} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {item.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {item.description}
            </p>
          </div>

          {isOwn && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  aria-label="Announcement options"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-7">
                <DropdownMenuRow
                  iconCircle
                  icon={<Edit2 />}
                  label="Edit"
                  iconSize={4}
                  onClick={() => onEdit(item)}
                />
                <DropdownMenuRow
                  iconCircle
                  icon={<Trash2 />}
                  label="Delete"
                  iconSize={4}
                  onClick={() => onDelete(item.id)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(item.createdAt)}
          </span>

          <span>
            From{" "}
            <span className="text-violet-600 font-medium">{displayName}</span>
          </span>

          {item.isPublic ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <Globe className="h-3 w-3" />
              Public
            </span>
          ) : item.team ? (
            <span className="flex items-center gap-1 text-indigo-600">
              <Users className="h-3 w-3" />
              {item.team.name}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}
