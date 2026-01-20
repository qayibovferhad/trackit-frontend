import { useQuery } from "@tanstack/react-query";
import { getConversationById } from "../services/conversation";

export function useConversation(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversationById(conversationId as string),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
  });
}