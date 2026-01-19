import { markConversationAsRead } from "@/features/inbox/services/conversation";
import type { Message } from "@/features/inbox/types/messages";
import { useSocket } from "@/shared/hooks/useSocket";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";

export const SocketProvider = ({ children }: { children: any }) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [isPending, startTransition] = useTransition();
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const setTypingUser = useChatStore((state) => state.setTypingUser);

  const { mutate: markAsRead } = useMutation({
    mutationFn: (id: string) => markConversationAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['conversations'], (old: any) => {
        if (!old) return old;
        return old.map((c: any) => c.id === id ? { ...c, unreadCount: 0 } : c);
      });
    }
  });
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg: Message) => {
      startTransition(() => {
        queryClient.setQueryData(['messages', msg.conversationId], (old: any) => {
          if (!old) return { pages: [{ messages: [msg], hasMore: false }], pageParams: [undefined] };

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
            page.messages.some((m: Message) => m.id === msg.id || (msg.tempId && m.tempId === msg.tempId))
          );

          if (!messageExists && newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              messages: [...newPages[0].messages, msg]
            };
          }

          return {
            ...old,
            pages: newPages
          };
        });
      });

      queryClient.setQueryData(['conversations'], (old: any) => {
        if (!old) return old;

        return old.map((conv: any) => {
          if (conv.id === msg.conversationId) {
            const shouldMarkAsRead = msg.conversationId === activeConversationId && msg.senderId !== user?.id;

            return {
              ...conv,
              lastMessage: {
                attachments: msg.attachments,
                content: msg.content,
                createdAt: msg.createdAt,
                sender: msg.sender
              },
              updatedAt: msg.createdAt,
              unreadCount: shouldMarkAsRead
                ? 0
                : (msg.senderId !== user?.id && msg.conversationId !== activeConversationId
                  ? (conv.unreadCount || 0) + 1
                  : conv.unreadCount)
            };
          }
          return conv;
        });
      });

      if (msg.conversationId === activeConversationId && msg.senderId !== user?.id) {
        markAsRead(activeConversationId);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, queryClient, activeConversationId, user?.id, markAsRead]);

  useEffect(() => {
    if (!socket) return;

    const handleUserStatusChanged = (payload: {
      userId: string;
      isOnline: boolean;
      lastSeenAt?: string;
    }) => {
      queryClient.setQueryData(['conversations'], (old: any[]) => {
        if (!old) return old;


        return old.map(conv => ({
          ...conv,
          participants: conv.participants?.map((p: any) =>
            p.userId === payload.userId
              ? {
                ...p,
                user: {
                  ...p.user,
                  isOnline: payload.isOnline,
                  lastSeenAt: payload.lastSeenAt ?? p.user?.lastSeenAt,
                },
              }
              : p
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
            p.user.id === payload.userId
              ? {
                ...p,
                user: {
                  ...p.user,
                  isOnline: payload.isOnline,
                  lastSeenAt: payload.lastSeenAt ?? p.user.lastSeenAt,
                },
              }
              : p
          ),
        };
      });
    };

    socket.on('userStatusChanged', handleUserStatusChanged);

    return () => {
      socket.off('userStatusChanged', handleUserStatusChanged);
    };
  }, [socket, queryClient]);


  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: {
      userId: string,
      isTyping: boolean,
      name: string,
      avatar: string,
      conversationId: string;
    }) => {
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
    };

    socket.on("userTyping", handleUserTyping);
    return () => {
      socket.off("userTyping", handleUserTyping);
    };
  }, [socket, user?.id, setTypingUser]);
  return <>{children}</>;
};