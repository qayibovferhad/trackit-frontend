// Inbox.tsx - User info ilə optimistic update
import { useEffect, useState, useCallback, useTransition, useMemo } from "react";
import Conversations from "../components/Conversations";
import ChatHeader, { ChatHeaderSkeleton } from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import { useSocket, addPendingMessage } from "@/shared/hooks/useSocket";
import { useUserStore } from "@/stores/userStore";
import type { Message } from "../types/messages";
import { getConversationById } from "../services/conversation";

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

  console.log(conversation,'conversation');
  

  const handleNewMessage = useCallback((msg:Message) => {
    console.log('New message received:', msg);
    
    startTransition(() => {
      queryClient.setQueryData(['messages', conversationId], (old) => {
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
  }, [conversationId, queryClient]);

  useEffect(() => {
    if (!conversationId || !socket) {
      setCurrentConversation(null);
      return;
    }

    setCurrentConversation(conversationId);

    if (isConnected) {
      socket.emit("join", conversationId);
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, socket, isConnected, handleNewMessage, setCurrentConversation]);

  const handleSelect = (id:string) => {
    navigate(`/inbox/${id}`);
  };

  const sendMessage = useCallback((messageText: string) => {
    if (!messageText.trim() || !conversationId || !socket || !user)return

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
        name: otherUser.username,
        avatar: otherUser.profileImage,
        lastSeen: otherUser.lastSeen,
        isGroup: false,
        participants:[{user:otherUser}]

      };
    }

    if (type === 'GROUP') {
      const participantCount = participants.length;

      return {
        name: name || `Group (${participantCount})`,
        avatar: null, 
        lastSeen: `${participantCount} participants`,
        isGroup: true,
        participants:participants.filter(pr=>pr.userId !== user.id) || [],
      };
    }

    return null;
  }, [conversation, user]);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50">
      <Conversations onSelect={handleSelect} />

      <div className="flex-1 flex flex-col bg-white">
                 {!chatHeaderData ? <ChatHeaderSkeleton/> : 
                 <ChatHeader 
                    name={chatHeaderData.name}
                    lastSeen={chatHeaderData.lastSeen}
                    avatar={chatHeaderData.avatar}
                    isGroup={chatHeaderData.isGroup}
                    participants={chatHeaderData.participants}

                  />} 
        <MessagesArea messages={messages} showTyping={isPending} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}