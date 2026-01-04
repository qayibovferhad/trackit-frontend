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
                queryClient.setQueryData(['messages', msg.conversationId], (old: Message[]) => {
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
                        const shouldMarkAsRead = msg.conversationId === activeConversationId && msg.senderId !== user?.id;

                        return {
                            ...conv,
                            lastMessage: {
                                content: msg.content,
                                createdAt: msg.createdAt,
                                sender: msg.sender
                            },
                            updatedAt: msg.createdAt,
                            unreadCount: shouldMarkAsRead ? 0 : (msg.senderId !== user?.id && msg.conversationId !== activeConversationId
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
    }, [socket, queryClient, activeConversationId]);


    useEffect(() => {
        if (!socket) return;

        const handleUserStatusChanged = (payload: {
            userId: string;
            isOnline: boolean;
            lastSeenAt?: string;
        }) => {
            queryClient.setQueryData(['conversations'], (old: any[]) => {
                if (!old) return old;

                console.log(payload, 'payload');

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
    return <>{children}</>;
};