import { useEffect, useTransition, useMemo } from "react";
import Conversations from "../components/Conversations";
import ChatHeader, { ChatHeaderSkeleton } from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "@/shared/hooks/useSocket";
import { useUserStore } from "@/stores/userStore";
import { useChatStore } from "@/stores/chatStore";
import { useConversation } from "../hooks/useConversation";
import { useMessages } from "../hooks/useMessages";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import { useSendMessage } from "../hooks/useSendMessage";
import { useChatHeader } from "../hooks/useChatHeader";
import { useTypingIndicator } from "../hooks/useTypingIndicator";

export default function Inbox() {
  const typingUsers = useChatStore((state) => state.typingUsers);
  const [isPending, startTransition] = useTransition();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected, setCurrentConversation } = useSocket();
  const { user } = useUserStore();
  const { setActiveConversation } = useChatStore();
  const { data: conversation } = useConversation(conversationId);
  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(conversationId);
  const { markAsRead } = useMarkAsRead();
  const { sendMessage } = useSendMessage(conversationId, startTransition);
  const chatHeaderData = useChatHeader(conversation, user);
  const { handleTyping } = useTypingIndicator(conversationId, socket, user);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
    return () => {
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation]);

  useEffect(() => {
    if (!conversationId || !socket) {
      setCurrentConversation(null);
      return;
    }
    setCurrentConversation(conversationId);
    if (isConnected) {
      socket.emit("join", conversationId);
    }
  }, [conversationId, socket, isConnected, setCurrentConversation]);

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId)
    }
  }, [conversationId]);

  const handleSelect = (id: string) => {
    navigate(`/inbox/${id}`);
  };

  const currentTypingUsers = useMemo(() => {
    const user = typingUsers[conversationId!];
    return user ? [user] : [];
  }, [typingUsers, conversationId]);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50">
      <Conversations onSelect={handleSelect} typingUsers={typingUsers}
      />
      {conversation && <div className="flex-1 flex flex-col bg-white">
        {!chatHeaderData ? <ChatHeaderSkeleton /> :
          <ChatHeader
            name={chatHeaderData.name}
            username={chatHeaderData.username ?? ""}
            lastSeenAt={chatHeaderData.lastSeenAt}
            isOnline={chatHeaderData.isOnline}
            avatar={chatHeaderData.avatar ?? ""}
            isGroup={chatHeaderData.isGroup}
            participants={chatHeaderData.participants}
          />}
        <MessagesArea
          messages={messages}
          showTyping={isPending}
          typingUsers={currentTypingUsers}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
        <MessageInput onSend={sendMessage} onTyping={handleTyping} />
      </div>
      }
    </div>
  );
}