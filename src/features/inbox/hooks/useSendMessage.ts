import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket, addPendingMessage } from "@/shared/hooks/useSocket";
import { useUserStore } from "@/stores/userStore";
import { uploadMessageAttachments } from "../services/messages";
import type { Attachment, Message } from "../types/messages";

export function useSendMessage(
    conversationId: string | undefined,
    startTransition: React.TransitionStartFunction
) {
    const queryClient = useQueryClient();
    const { socket } = useSocket();
    const { user } = useUserStore();

    const uploadAttachmentsMutation = useMutation({
        mutationFn: uploadMessageAttachments,
    });

    const sendMessage = useCallback(async (messageText: string, files: File[]) => {
        if (!messageText.trim() && (!files || files.length === 0)) return;
        if (!conversationId || !socket || !user) return;

        const messageContent = messageText.trim();
        const tempId = `temp-${Date.now()}`;
        let attachments: Attachment[] = [];

        // Upload attachments if any
        if (files.length > 0) {
            attachments = await uploadAttachmentsMutation.mutateAsync(files);
        }

        // Create optimistic message
        const optimisticMessage = {
            id: tempId,
            tempId: tempId,
            conversationId,
            content: messageContent,
            senderId: user.id,
            sender: { ...user },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOptimistic: true,
            attachments
        };

        // Update messages cache optimistically
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

                return { ...old, pages: newPages };
            });
        });

        // Prepare message data
        const messageData = {
            conversationId,
            content: messageContent,
            tempId: tempId,
            attachments
        };

        // Handle socket response
        const handleResponse = (response: { success?: boolean; needsRefresh?: boolean, messageId: string } | undefined) => {
            if (response?.success) {

                queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });

                // Update conversations list
                queryClient.setQueryData(['conversations'], (old: any) => {
                    if (!old) return old;

                    return old.map((conv: any) => {
                        if (conv.id === conversationId) {
                            return {
                                ...conv,
                                lastMessage: {
                                    id: response?.messageId,
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
                // Remove optimistic message on failure
                startTransition(() => {
                    queryClient.setQueryData(['messages', conversationId], (old: any) => {
                        if (!old) return old;

                        const newPages = old.pages.map((page: any) => ({
                            ...page,
                            messages: page.messages.filter((m: Message) => m.tempId !== tempId)
                        }));

                        return { ...old, pages: newPages };
                    });
                });
            }
        };

        socket.emit("sendMessage", messageData, handleResponse);
    }, [conversationId, socket, queryClient, user, startTransition, uploadAttachmentsMutation]);

    return { sendMessage };
}
