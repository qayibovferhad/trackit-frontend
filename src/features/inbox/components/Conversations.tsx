import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import AddConversationModal from "./AddConversationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, getConversations } from "../services/conversation";
import { useUserStore } from "@/stores/userStore";
import type { Message } from "../types/messages";
import type { Conversation } from "../types/conversation";

interface ConversationsProps {
  onSelect: (id: string) => void
  typingUsers: Record<
    string,
    { id: string; name: string; avatar: string }
  >;
}

const getLastMessagePreview = (message?: Message) => {
  console.log(message,'message');
  
  if (!message) return "No messages yet";

  
  if (message.content) return message.content;

  if (message.attachments && message.attachments?.length > 0) {
    const first = message.attachments[0];

    if (first.type?.startsWith("image")) return "📷 Photo";
    if (first.type?.startsWith("video")) return "🎥 Video";
    if (first.type?.startsWith("audio")) return "🎵 Audio";

    return "📎 Attachment";
  }

  return "No messages yet";
};

const ConversationItem = ({ conv, isGroup = false, onSelect, typingUser }: { conv: Conversation, isGroup?: boolean, onSelect: (id: string) => void, typingUser?: { id: string; name: string; avatar: string }; }) => {
  const { user } = useUserStore()

  const isDirect = conv.type === 'DIRECT';

  
  const otherParticipant = isDirect
    ? conv.participants.find((p: any) => p.userId !== user?.id)
    : null;

    console.log(otherParticipant,'otherParticipant');
    
  const isOnline = otherParticipant?.user?.isOnline;
  const unreadCount = conv.unreadCount || 0;

  
  if (isGroup) {
    return (
      <div
        onClick={() => onSelect(conv.id)}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer relative"
      >
        <div className="flex -space-x-2">
          {conv.participants.slice(0, 2).map((p: any) => (
            <UserAvatar
              key={p.user.id}
              src={p.user.profileImage}
              name={p.user.username}
            />
          ))}
          {conv.participants.length > 2 && (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium border-2 border-white">
              +{conv.participants.length - 2}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm truncate">
              {conv.name || 'Unnamed Group'}
            </p>
            {unreadCount > 0 && (
              <span className="ml-2 bg-violet-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {typingUser
              ? `${typingUser.name} typing...`
              : getLastMessagePreview(conv.lastMessage)}
          </p>
        </div>
      </div>
    );
  }

  const otherUser = conv.participants.find((p: any) => p.user.id !== user?.id)?.user;

  console.log('conv',conv);
  
  return (
    <div
      onClick={() => onSelect(conv.id)}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer relative"
    >
    <div className="relative">
    <UserAvatar
      src={otherUser?.profileImage}
      name={otherUser?.username}
    />
    {isOnline && (
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
    )}
  </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm truncate">
            {otherUser?.username}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 bg-violet-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          {typingUser
              ? `Typing...`
              : getLastMessagePreview(conv.lastMessage)}
        </p>
      </div>
    </div>
  );
}



export default function Conversations({ onSelect, typingUsers }: ConversationsProps) {
  const [openModal, setOpenModal] = useState(false)
  const queryClient = useQueryClient();


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
  const sortedConversations = useMemo(() => {
    if (!data) return { direct: [], group: [] };

    const sorted = [...data].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : new Date(a.updatedAt).getTime();
      const dateB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });

    return {
      direct: sorted.filter(conv => conv.type === 'DIRECT'),
      group: sorted.filter(conv => conv.type === 'GROUP')
    };
  }, [data]);

  const directConversations = sortedConversations?.direct
  const groupConversations = sortedConversations?.group

  
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
          {directConversations.map(conv => (
            <ConversationItem conv={conv} onSelect={onSelect}
              typingUser={typingUsers[conv.id]}
            />
          ))}
        </div>
      )}

      {groupConversations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Group Chats</h3>
          {groupConversations.map(conv => (
            <ConversationItem conv={conv} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  </div>
    {openModal && <AddConversationModal open={openModal} setOpen={setOpenModal} onStartConversation={handleStartConversation} />}
  </>
}