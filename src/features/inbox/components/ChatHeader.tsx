import UserAvatar from "@/shared/components/UserAvatar";
import { MoreVertical } from "lucide-react";


interface ChatHeaderProps {
    name: string
    lastSeen: string
}
export default function ChatHeader({ name, lastSeen }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
                <UserAvatar name={name} size="lg" />
                <div>
                    <h2 className="font-semibold text-gray-900">{name}</h2>
                    <p className="text-sm text-gray-500">{lastSeen}</p>
                </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}