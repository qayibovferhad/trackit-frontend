import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { MoreVertical, Plus } from "lucide-react";

export default function Conversations() {

    const conversations = [
        {
            id: 1,
            name: 'Robert Anderson',
            avatar: 'https://i.pravatar.cc/150?img=12',
            time: 'Just now',
            preview: "I'll do that task now, you can...",
            unread: 0
        },
        {
            id: 2,
            name: 'Henry Kane',
            avatar: 'https://i.pravatar.cc/150?img=33',
            time: '30mins ago',
            preview: 'Here is UX research Documen...',
            unread: 3
        },
        {
            id: 3,
            name: 'Juliana Wills',
            avatar: 'https://i.pravatar.cc/150?img=45',
            time: '3h ago',
            preview: 'If you complete Webdesign Ta...',
            unread: 0
        },
        {
            id: 4,
            name: 'Emma Olivia',
            avatar: 'https://i.pravatar.cc/150?img=47',
            time: 'a day ago',
            preview: 'Are you there?',
            unread: 0
        },
        {
            id: 5,
            name: 'Benjamin Jack',
            avatar: 'https://i.pravatar.cc/150?img=51',
            time: '2d ago',
            preview: 'Hi 👋',
            unread: 2
        }
    ];
    return <div className="w-120 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                    <p className="text-sm text-gray-500">Direct and team messages</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                </button>
            </div>

            <Button className="w-full" variant="violet">
                <Plus size={18} />Create Conversation
            </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer border-b border-gray-100 transition-colors ${conv.id === 3 ? 'bg-gray-200' : ''
                        }`}
                >
                    <div className="relative">
                        <UserAvatar src={conv.avatar} size="lg" />

                        {conv.unread > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-medium">
                                {conv.unread}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{conv.name}</span>
                            <span className="text-xs text-gray-500">{conv.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.preview}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
}