import { useMarkAsRead } from "@/features/inbox/hooks/useMarkAsRead";
import type { Conversation } from "@/features/inbox/types/conversation";
import type { Message } from "@/features/inbox/types/messages";
import { useSocket } from "@/shared/hooks/useSocket";
import { getAccessToken } from "@/shared/lib/authStorage";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useTransition } from "react";

interface UserTypingPayload {
  userId: string;
  isTyping: boolean;
  name: string;
  avatar: string;
  conversationId: string;
}

interface UserStatusPayload {
  userId: string;
  isOnline: boolean;
  lastSeenAt?: string;
}

export const SocketProvider = ({ children }: { children: any }) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [_, startTransition] = useTransition();
  const { markAsRead } = useMarkAsRead()

  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const setTypingUser = useChatStore((state) => state.setTypingUser);

  const updateMessagesCache = useCallback((msg: Message) => {
    queryClient.setQueryData(['messages', msg.conversationId], (old: any) => {
      if (!old) {
        return {
          pages: [{ messages: [msg], hasMore: false }],
          pageParams: [undefined]
        };
      }

      const newPages = old.pages.map((page: any) => {
        const messages = page.messages || [];

        if (msg.tempId && messages.some((m: Message) => m.tempId === msg.tempId)) {
          return {
            ...page,
            messages: messages.map((m: Message) =>
              m.tempId === msg.tempId ? { ...msg, isOptimistic: false } : m
            )
          };
        }

        if (messages.some((m: Message) => m.id === msg.id)) {
          return page;
        }

        return page;
      });

      const messageExists = newPages.some((page: any) =>
        page.messages.some((m: Message) =>
          m.id === msg.id || (msg.tempId && m.tempId === msg.tempId)
        )
      );

      if (!messageExists && newPages[0]) {
        newPages[0] = {
          ...newPages[0],
          messages: [...newPages[0].messages, msg]
        };
      }

      return { ...old, pages: newPages };
    });
  }, [queryClient]);

  const updateConversationsCache = useCallback((msg: Message) => {
    queryClient.setQueryData(['conversations'], (old: Conversation[]) => {
      if (!old) return old;

      return old.map((conv) => {
        if (conv.id !== msg.conversationId) return conv;

        const isActiveConversation = msg.conversationId === activeConversationId;
        const isOwnMessage = msg.senderId === user?.id;
        const shouldMarkAsRead = isActiveConversation && !isOwnMessage;

        let newUnreadCount = conv.unreadCount || 0;

        if (shouldMarkAsRead) {
          newUnreadCount = 0;
        } else if (!isOwnMessage && !isActiveConversation) {
          newUnreadCount += 1;
        }

        return {
          ...conv,
          lastMessage: {
            attachments: msg.attachments,
            content: msg.content,
            createdAt: msg.createdAt,
            sender: msg.sender
          },
          updatedAt: msg.createdAt,
          unreadCount: newUnreadCount
        };
      });
    });
  }, [queryClient, activeConversationId, user?.id]);

  const handleNewMessage = useCallback((msg: Message) => {
    startTransition(() => {
      updateMessagesCache(msg);
      updateConversationsCache(msg);
    });

    const isActiveConversation = msg.conversationId === activeConversationId;
    const isOwnMessage = msg.senderId === user?.id;

    if (isActiveConversation && !isOwnMessage) {
      markAsRead(activeConversationId);
    }
  }, [updateMessagesCache, updateConversationsCache, activeConversationId, user?.id, markAsRead]);

  const updateParticipantStatus = useCallback((participant: any, payload: UserStatusPayload) => {
    if (participant.userId !== payload.userId) {
      return participant;
    }
      
    return {
      ...participant,
      user: {
        ...participant.user,
        isOnline: payload.isOnline,
        lastSeenAt: payload.lastSeenAt ?? participant.user?.lastSeenAt,
      },
    };
  }, []);

  const handleUserStatusChanged = useCallback((payload: UserStatusPayload) => {
    queryClient.setQueryData(['conversations'], (old: Conversation[]) => {
      if (!old) return old;

      return old.map(conv => ({
        ...conv,
        participants: conv.participants?.map((p: any) =>
          updateParticipantStatus(p, payload)
        ),
      }));
    });

    const activeId = useChatStore.getState().activeConversationId;
    if (!activeId) return;

    queryClient.setQueryData(['conversation', activeId], (old: any) => {
      if (!old) return old;

      return {
        ...old,
        participants: old.participants.map((p: any) =>
          updateParticipantStatus(p, payload)
        ),
      };
    });
  }, [queryClient, updateParticipantStatus]);

  const handleUserTyping = useCallback((data: UserTypingPayload) => {
    if (data.userId === user?.id) return;

    startTransition(() => {
      if (data.isTyping) {
        setTypingUser(data.conversationId, {
          id: data.userId,
          name: data.name,
          avatar: data.avatar
        });
      } else {
        setTypingUser(data.conversationId, null);
      }
    });
  }, [user?.id, setTypingUser]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    const token = getAccessToken();
    if (token) {
      (socket as any).auth = { token };
      socket.disconnect().connect();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on('userStatusChanged', handleUserStatusChanged);
    return () => {
      socket.off('userStatusChanged', handleUserStatusChanged);
    };
  }, [socket, handleUserStatusChanged]);

  useEffect(() => {
    if (!socket) return;

    socket.on("userTyping", handleUserTyping);
    return () => {
      socket.off("userTyping", handleUserTyping);
    };
  }, [socket, handleUserTyping]);
  return <>{children}</>;
};