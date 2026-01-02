import { markConversationAsRead } from "@/features/inbox/services/conversation";
import type { Conversation } from "@/features/inbox/types/conversation";
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
            console.log('mesg', msg);
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

            // 2. Çatlar (conversations) siyahısını yenilə (son mesajı dəyiş və s.)
            //   queryClient.setQueryData(['conversations'], (old: Conversation[]) => {
            //     if (!old) return old;
            //     return old.map(conv => conv.id === msg.conversationId ? { ...conv, lastMessage: msg } : conv);
            //   });
            console.log(activeConversationId, 'activeConversationId');

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

            // 3. Əgər istifadəçi o çatda deyilsə, Desktop bildirişi və ya Toast çıxar
            //   if (currentConversationId !== msg.conversationId) {
            //      // showToast(`Yeni mesaj: ${msg.content}`);
            //   }
        });

        return () => {
            socket.off("newMessage");
        };
    }, [socket, queryClient]);

    return <>{children}</>;
};