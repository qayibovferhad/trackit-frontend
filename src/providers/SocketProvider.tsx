import { markConversationAsRead } from "@/features/inbox/services/conversation";
import type { Message } from "@/features/inbox/types/messages";
import { useSocket } from "@/shared/hooks/useSocket";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";

// SocketProvider.tsx
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
            console.log(msg,'msg');
            
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

            console.log(activeConversationId,'activeConversationId');
            

            if (msg.conversationId === activeConversationId && msg.senderId !== user?.id) {
                markAsRead(activeConversationId);
            }
        });

        return () => {
            socket.off("newMessage");
        };
    }, [socket, queryClient,activeConversationId]);

    return <>{children}</>;
};