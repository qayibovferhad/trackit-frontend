import { useEffect, useCallback, useTransition, useMemo } from "react";
import Conversations from "../components/Conversations";
import ChatHeader, { ChatHeaderSkeleton } from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import { useSocket, addPendingMessage } from "@/shared/hooks/useSocket";
import { useUserStore } from "@/stores/userStore";
import type { Message } from "../types/messages";
import { getConversationById, markConversationAsRead } from "../services/conversation";

export default function Inbox() {
  const [isPending, startTransition] = useTransition();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected, setCurrentConversation } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversationById(conversationId as string),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId as string),
    enabled: !!conversationId
  });

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

const handleNewMessage = useCallback((msg: Message) => {
    console.log('New message received:', msg);

    startTransition(() => {
      queryClient.setQueryData(['messages', msg.conversationId], (old) => {
        if (!old) return [msg];

        if (msg.tempId && old.some(m => m.tempId === msg.tempId)) {
          return old.map(m =>
            m.tempId === msg.tempId ? { ...msg, isOptimistic: false } : m
          );
        }

        if (old.some(m => m.id === msg.id)) {
          return old;
        }

        return [...old, msg];
      });
    });
    
    queryClient.setQueryData(['conversations'], (old: any) => {
      if (!old) return old;
      return old.map((conv: any) => {
        if (conv.id === msg.conversationId) {
          // Əgər mesaj aktiv konuşmada gəlirsə və başqa biri göndəribsə
          const shouldMarkAsRead = msg.conversationId === conversationId && msg.senderId !== user?.id;
          
          return {
            ...conv,
            lastMessage: {
              content: msg.content,
              createdAt: msg.createdAt,
              sender: msg.sender
            },
            updatedAt: msg.createdAt,
            // Aktiv konuşmadaysa unread count artmasın
            unreadCount: shouldMarkAsRead ? 0 : (msg.senderId !== user?.id && msg.conversationId !== conversationId 
              ? (conv.unreadCount || 0) + 1 
              : conv.unreadCount)
          };
        }
        return conv;
      });
    });

    // Əgər mesaj aktiv konuşmada gəlirsə və başqa biri göndəribsə, mark as read et
    if (msg.conversationId === conversationId && msg.senderId !== user?.id) {
      markAsReadMutation(conversationId);
    }
  }, [queryClient, conversationId, user, markAsReadMutation]);
  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

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
    if(conversationId){
      markAsReadMutation(conversationId)
    }
  }, [conversationId]);

  const handleSelect = (id: string) => {
    navigate(`/inbox/${id}`);
  };

  const sendMessage = useCallback((messageText: string) => {
    if (!messageText.trim() || !conversationId || !socket || !user) return

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}`;
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
    };

    startTransition(() => {
      queryClient.setQueryData(['messages', conversationId], (old) => [
        ...(old ?? []),
        optimisticMessage,
      ]);
    });

    const messageData = {
      conversationId,
      content: messageContent,
      tempId: tempId,
    };

    const handleResponse = (response) => {
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
          queryClient.setQueryData(['messages', conversationId], (old) =>
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
        avatar: otherUser.profileImage,
        lastSeen: otherUser.lastSeen,
        isGroup: false,
        participants: [{ user: otherUser }]
      };
    }

    if (type === 'GROUP') {
      const participantCount = participants.length;

      return {
        name: name || `Group (${participantCount})`,
        avatar: null,
        lastSeen: `${participantCount} participants`,
        isGroup: true,
        participants: participants.filter(pr => pr.userId !== user.id) || [],
      };
    }

    return null;
  }, [conversation, user]);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50">
      <Conversations onSelect={handleSelect} />

      {conversation && <div className="flex-1 flex flex-col bg-white">
        {!chatHeaderData ? <ChatHeaderSkeleton /> :
          <ChatHeader
            name={chatHeaderData.name}
            username={chatHeaderData.username}
            lastSeen={chatHeaderData.lastSeen}
            avatar={chatHeaderData.avatar}
            isGroup={chatHeaderData.isGroup}
            participants={chatHeaderData.participants}
          />}
        <MessagesArea messages={messages} showTyping={isPending} />
        <MessageInput onSend={sendMessage} />
      </div>
      }
    </div>
  );
}