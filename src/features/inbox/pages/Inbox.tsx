import { useEffect, useCallback, useTransition, useMemo, useState } from "react";
import Conversations from "../components/Conversations";
import ChatHeader, { ChatHeaderSkeleton } from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, uploadMessageAttachments } from "../services/messages";
import { useSocket, addPendingMessage } from "@/shared/hooks/useSocket";
import { useUserStore } from "@/stores/userStore";
import type { Attachment, Message } from "../types/messages";
import { getConversationById, markConversationAsRead } from "../services/conversation";
import { useChatStore } from "@/stores/chatStore";

export default function Inbox() {
  const typingUsers = useChatStore((state) => state.typingUsers);
  const [isPending, startTransition] = useTransition();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected, setCurrentConversation } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { setActiveConversation } = useChatStore();


  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversationById(conversationId as string),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam }) => getMessages(conversationId as string, pageParam),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!conversationId,
    initialPageParam: undefined as string | undefined,
  });



  const messages = useMemo(() => {
    if (!messagesData) return [];
    const reversedPages = [...messagesData.pages].reverse();
    const allMessages = reversedPages.flatMap(page => page.messages);

    const uniqueMap = new Map();
    allMessages.forEach(msg => {
      if (!uniqueMap.has(msg.id)) {
        uniqueMap.set(msg.id, msg);
      }
    });

    return Array.from(uniqueMap.values());
  }, [messagesData]);

  console.log(messages, 'messages');



  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (convId: string) => markConversationAsRead(convId),
    onMutate: async (convId) => {
      const previousConversations = queryClient.getQueryData(['conversations']);

      queryClient.setQueryData(['conversations'], (old: any) => {
        if (!old) return old;
        return old.map((conv: any) =>
          conv.id === convId ? { ...conv, unreadCount: 0 } : conv
        );
      });

      return { previousConversations };
    },
    onError: (err, convId, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(['conversations'], context.previousConversations);
      }
    },
    onSuccess: () => {
    }
  });

  useEffect(() => {

    if (conversationId) {
      setActiveConversation(conversationId);
    }

    return () => {
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation]);

  const uploadAttachmentsMutation = useMutation({
    mutationFn: uploadMessageAttachments,
  });


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
      markAsReadMutation(conversationId)
    }
  }, [conversationId]);

  const handleSelect = (id: string) => {
    navigate(`/inbox/${id}`);
  };

  const sendMessage = useCallback(async (messageText: string, files: File[]) => {
    if (!messageText.trim() && (!files || files.length === 0) || !conversationId || !socket || !user) return

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}`;
    let attachments: Attachment[] = [];


    if (files.length > 0) {
      attachments = await uploadAttachmentsMutation.mutateAsync(files);
    }
    const optimisticMessage = {
      id: tempId,
      tempId: tempId,
      conversationId,
      content: messageContent,
      senderId: user.id,
      sender: {
        ...user
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true,
      attachments
    };

    handleTyping(false);

    startTransition(() => {
      queryClient.setQueryData(['messages', conversationId], (old: any) => {
        if (!old) {
          return {
            pages: [{ messages: [optimisticMessage], hasMore: false }],
            pageParams: [undefined]
          };
        }

        const newPages = [...old.pages];
        if (newPages[0]) {
          newPages[0] = {
            ...newPages[0],
            messages: [...newPages[0].messages, optimisticMessage]
          };
        }

        return {
          ...old,
          pages: newPages
        };
      });
    });


    const messageData = {
      conversationId,
      content: messageContent,
      tempId: tempId,
      attachments
    };

    const handleResponse = (response: {
      success?: boolean;
      needsRefresh?: boolean;
    } | undefined) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
        queryClient.setQueryData(['conversations'], (old: any) => {
          if (!old) return old;

          return old.map((conv: any) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: {
                  content: messageContent,
                  attachments,
                  createdAt: new Date().toISOString(),
                  sender: user
                },
                updatedAt: new Date().toISOString()
              };
            }
            return conv;
          });
        });
      } else if (response?.needsRefresh) {
        addPendingMessage(messageData, handleResponse);
      } else {
        startTransition(() => {
          queryClient.setQueryData(['messages', conversationId], (old: Message[]) =>
            old?.filter(m => m.tempId !== tempId) ?? []
          );
        });
      }
    };

    socket.emit("sendMessage", messageData, handleResponse);
  }, [conversationId, socket, queryClient, user]);

  const chatHeaderData = useMemo(() => {
    if (!conversation || !user) return null;

    const { type, participants, name } = conversation;

    if (type === 'DIRECT') {
      const otherUser = participants.find(
        (p) => p.user.id !== user.id
      )?.user;

      if (!otherUser) return null;


      return {
        username: otherUser.username,
        name: otherUser.name,
        isOnline: otherUser.isOnline,
        avatar: otherUser.profileImage,
        lastSeenAt: otherUser.lastSeenAt,
        isGroup: false,
        participants: [{ user: otherUser }]
      };
    }

    if (type === 'GROUP') {
      const participantCount = participants.length;

      return {
        name: name || `Group (${participantCount})`,
        avatar: null,
        lastSeenAt: null,
        isGroup: true,
        isOnline: false,
        participants: participants.filter(pr => pr.userId !== user.id) || [],
      };
    }

    return null;
  }, [conversation, user]);


  const handleTyping = useCallback((isTyping: boolean) => {
    if (!conversationId || !socket) return;

    socket.emit("typing", {
      conversationId,
      isTyping,
      name: user?.name,
      avatar: user?.profileImage
    });

  }, [conversationId, socket, user]);



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
          typingUsers={typingUsers[conversationId!] ? [typingUsers[conversationId!]] : []}
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