// Inbox.tsx - User info ilə optimistic update
import { useEffect, useState, useCallback, useTransition } from "react";
import Conversations from "../components/Conversations";
import ChatHeader from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import { useSocket, addPendingMessage } from "@/shared/hooks/useSocket";
import { useUserStore } from "@/stores/userStore";

export default function Inbox() {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected, setCurrentConversation } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useUserStore(); // Mövcud user məlumatı

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId
  });

  const handleNewMessage = useCallback((msg) => {
    console.log('New message received:', msg);
    
    startTransition(() => {
      queryClient.setQueryData(['messages', conversationId], (old) => {
        if (!old) return [msg];
        
        // Optimistic message varsa, onu real message ilə əvəz et
        if (msg.tempId && old.some(m => m.tempId === msg.tempId)) {
          return old.map(m => 
            m.tempId === msg.tempId ? { ...msg, isOptimistic: false } : m
          );
        }
        
        // Duplicate check
        if (old.some(m => m.id === msg.id)) {
          return old;
        }
        
        return [...old, msg];
      });
    });
  }, [conversationId, queryClient]);

  useEffect(() => {
    if (!conversationId || !socket) {
      console.log('Socket not ready:', { conversationId, socket: !!socket });
      setCurrentConversation(null);
      return;
    }

    console.log('Setting up conversation:', conversationId);
    setCurrentConversation(conversationId);

    if (isConnected) {
      console.log('Joining room:', conversationId);
      socket.emit("join", conversationId);
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log('Cleaning up conversation:', conversationId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, socket, isConnected, handleNewMessage, setCurrentConversation]);

  const handleSelect = (id) => {
    navigate(`/inbox/${id}`);
  };

  const sendMessage = useCallback((messageText: string) => {
    if (!messageText.trim() || !conversationId || !socket || !user) {
      console.log('Cannot send message:', { messageText, conversationId, socket: !!socket, user: !!user });
      return;
    }

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}`;
    // Optimistic update - user məlumatları ilə birlikdə
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

    console.log('Sending message:', { conversationId, content: messageContent });
    
    const messageData = {
      conversationId,
      content: messageContent,
      tempId: tempId,
    };

    const handleResponse = (response) => {
      console.log('Message sent response:', response);
      
      if (response?.success) {
        console.log('Message sent successfully');
        // Backend-dən real mesaj "newMessage" event ilə gələcək
      } else if (response?.needsRefresh) {
        console.log('Token expired during send, adding to pending queue');
        addPendingMessage(messageData, handleResponse);
      } else {
        // Xəta baş verdi, optimistic message-i sil
        console.error('Failed to send message:', response?.error);
        startTransition(() => {
          queryClient.setQueryData(['messages', conversationId], (old) => 
            old?.filter(m => m.tempId !== tempId) ?? []
          );
        });
      }
    };

    socket.emit("sendMessage", messageData, handleResponse);
  }, [conversationId, socket, queryClient, user]);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50">
      <Conversations onSelect={handleSelect} />

      <div className="flex-1 flex flex-col bg-white">
        <ChatHeader name='Farhad Qayibov' lastSeen='2hr ago' />

        <MessagesArea messages={messages} showTyping={isPending} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}