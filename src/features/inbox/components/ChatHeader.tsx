import UserAvatar from "@/shared/components/UserAvatar";
import { timeAgo } from "@/shared/utils/date";
import { MoreVertical } from "lucide-react";


interface ChatHeaderProps {
  name: string;
  lastSeenAt: string | null;
  avatar: string | null;
  isGroup: boolean;
  username: string;
  participants: Array<{ user: any }>;
  isOnline: boolean
}


export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b animate-pulse">
      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-full bg-gray-200" />

        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />

          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
    </div>
  );
}
export default function ChatHeader({ name, lastSeenAt, avatar, isGroup, participants, username, isOnline }: ChatHeaderProps) {

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {isGroup ? (
          <div className="flex -space-x-3">
            {participants.slice(0, 2).map((p) => (
              <UserAvatar
                key={p.user.id}
                src={p.user.profileImage}
                name={p.user.name}
                size="md"
                className="border-2 border-white rounded-full"
              />
            ))}

            {participants.length > 2 && (
              <div className="w-10 h-10 flex items-center justify-center text-sm bg-gray-300 text-gray-700 rounded-full border-2 border-white">
                +{participants.length - 2}
              </div>
            )}
          </div>
        ) : (
          <UserAvatar src={avatar} name={username} size="lg" />
        )}

        <div>
          <h2 className="font-semibold text-gray-900">{name}</h2>

          {!isGroup && <p className="text-sm text-gray-500">
            {isOnline ? "online" : `last seen ${timeAgo(lastSeenAt).toLocaleLowerCase()}`}
          </p>}

        </div>


      </div>

      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}