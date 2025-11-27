import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import AddConversationModal from "./AddConversationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, getConversations } from "../services/conversation";
import { useUserStore } from "@/stores/userStore";

interface ConversationsProps{
    onSelect:(id:string)=>void
}
export default function Conversations({onSelect}:ConversationsProps) {
    const [openModal, setOpenModal] = useState(false)
    const queryClient = useQueryClient();

    const { user } = useUserStore()

    const { mutate: startConversation, isPending } = useMutation({
        mutationFn: (payload: { userIds: string[], groupName?: string }) => createConversation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setOpenModal(false);
        }
    });

    const { data } = useQuery({ queryFn: getConversations, queryKey: ['conversations'] })

    const handleStartConversation = ({ userIds, groupName }: { userIds: string[], groupName?: string | undefined }) => {
        startConversation({ userIds, groupName });
    };


    const directConversations = data?.filter(conv => conv.type === 'DIRECT') || [];
    const groupConversations = data?.filter(conv => conv.type === 'GROUP') || [];
    
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
                        return <div key={conv.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg" onClick={() => onSelect(conv.id)}>
                            <UserAvatar src={myUser?.profileImage} name={myUser?.name} size="lg" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{myUser?.username}</p>
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                            </div>
                        </div>
                    })}
                </div>
            )}

            {groupConversations.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Group Chats</h3>
                    {groupConversations.map(conv => (
                        <div key={conv.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg" onClick={() => onSelect(conv.id)}>

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
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
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