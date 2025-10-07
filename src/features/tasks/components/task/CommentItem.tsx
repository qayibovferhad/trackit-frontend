import UserAvatar from "@/shared/components/UserAvatar";
import type { CommentType } from "../../types/tasks";
import { timeAgo } from "@/shared/utils/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRow,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";

export default function CommentItem({
  comment,
  onDelete,
  currentUserId,
}: {
  comment: CommentType;
  onDelete: (comment: CommentType) => void;
  currentUserId?: string;
}) {
  console.log(currentUserId, "currentUserId");

  return (
    <div className="flex gap-3 items-start group">
      <div className="flex-shrink-0">
        <UserAvatar
          name={comment.user?.name || comment.user?.username}
          src={comment.user?.profileImage}
          size="md"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-lg p-3">
          <p className="text-sm text-gray-800 break-words">{comment.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 px-3">
          <span className="font-medium text-violet-600">
            {comment.user.name || comment.user.username}
          </span>
          <span>•</span>
          <span>{timeAgo(comment.createdAt)}</span>
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all"
            aria-label="Comment options"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-7">
          <DropdownMenuRow
            iconCircle
            icon={<Trash2 />}
            label="Delete"
            iconSize={4}
            onClick={() => onDelete(comment)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
