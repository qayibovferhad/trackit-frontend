import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markConversationAsRead } from "../services/conversation";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const { mutate: markAsRead } = useMutation({
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
  });

  return { markAsRead };
}