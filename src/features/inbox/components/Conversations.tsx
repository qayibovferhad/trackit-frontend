import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import AddConversationModal from "./AddConversationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, getConversations } from "../services/conversation";
import { useUserStore } from "@/stores/userStore";

export default function Conversations() {
    const [openModal, setOpenModal] = useState(false)
    const queryClient = useQueryClient();

    const { user } = useUserStore()

    const { mutate: startConversation, isPending } = useMutation({
        mutationFn: (payload: { userIds: string[], groupName?: string }) => createConversation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setOpenModal(false);
        },
        onError: (error) => {
            console.error('Failed to create conversation:', error);
        }
    });

    const { data } = useQuery({ queryFn: getConversations, queryKey: ['conversations'] })
    const handleStartConversation = ({ userIds, groupName }: { userIds: string[], groupName?: string | undefined }) => {
        console.log(groupName, 'groupName');

        startConversation({ userIds, groupName });
    };


    const directConversations = data?.filter(conv => conv.type === 'DIRECT') || [];
    const groupConversations = data?.filter(conv => conv.type === 'GROUP') || [];
    // const conversations = [
    //     {
    //         id: 1,
    //         name: 'Robert Anderson',
    //         avatar: 'https://i.pravatar.cc/150?img=12',
    //         time: 'Just now',
    //         preview: "I'll do that task now, you can...",
    //         unread: 0
    //     },
    //     {
    //         id: 2,
    //         name: 'Henry Kane',
    //         avatar: 'https://i.pravatar.cc/150?img=33',
    //         time: '30mins ago',
    //         preview: 'Here is UX research Documen...',
    //         unread: 3
    //     },
    //     {
    //         id: 3,
    //         name: 'Juliana Wills',
    //         avatar: 'https://i.pravatar.cc/150?img=45',
    //         time: '3h ago',
    //         preview: 'If you complete Webdesign Ta...',
    //         unread: 0
    //     },
    //     {
    //         id: 4,
    //         name: 'Emma Olivia',
    //         avatar: 'https://i.pravatar.cc/150?img=47',
    //         time: 'a day ago',
    //         preview: 'Are you there?',
    //         unread: 0
    //     },
    //     {
    //         id: 5,
    //         name: 'Benjamin Jack',
    //         avatar: 'https://i.pravatar.cc/150?img=51',
    //         time: '2d ago',
    //         preview: 'Hi 👋',
    //         unread: 2
    //     }
    // ];
    return <> <div className="w-120 bg-white border-r border-gray-200 flex flex-col">
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

            <Button onClick={() => setOpenModal(true)} className="w-full" variant="violet" disabled={isPending}>
                <Plus size={18} />                        {isPending ? 'Creating...' : 'Create Conversation'}

            </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            {directConversations.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Direct Messages</h3>
                    {directConversations.map(conv => {
                        const myUser = conv.participants.find(p => p.user.id !== user?.id)?.user
                        return <div key={conv.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                            <UserAvatar src={myUser?.profileImage} name={myUser?.name} size="lg" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{conv.participants.find(p => p.user.id !== user?.id)?.user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.text}</p>
                            </div>
                        </div>
                    })}
                </div>
            )}

            {groupConversations.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Group Chats</h3>
                    {groupConversations.map(conv => (
                        <div key={conv.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg">

                            <div className="flex -space-x-2">
                                {conv.participants.slice(0, 2).map(p => (
                                    <UserAvatar
                                        key={p.user.id}
                                        src={p.user.profileImage}
                                        name={p.user.name}
                                        size="sm"
                                        className="border-2 border-white rounded-full"
                                    />
                                ))}
                                {conv.participants.length > 3 && (
                                    <div className="w-6 h-6 flex items-center justify-center text-xs bg-gray-300 text-gray-700 rounded-full border-2 border-white">
                                        +{conv.participants.length - 3}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 ml-2">
                                <p className="font-medium text-gray-900">{conv.name || 'Unnamed Group'}</p>
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
        {openModal && <AddConversationModal open={openModal} setOpen={setOpenModal} onStartConversation={handleStartConversation} />}
    </>
}