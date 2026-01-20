import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getMessages } from "../services/messages";
import type { Message } from "../types/messages";

export function useMessages(conversationId: string | undefined) {
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam }) => getMessages(conversationId as string, pageParam),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!conversationId,
    initialPageParam: undefined as string | undefined,
  });

  const messages = useMemo(() => {
    if (!messagesData) return [];
    
    const reversedPages = [...messagesData.pages].reverse();
    const allMessages = reversedPages.flatMap(page => page.messages);

    // Remove duplicates
    const uniqueMap = new Map<string, Message>();
    allMessages.forEach(msg => {
      if (!uniqueMap.has(msg.id)) {
        uniqueMap.set(msg.id, msg);
      }
    });

    return Array.from(uniqueMap.values());
  }, [messagesData]);

  return { messages, fetchNextPage, hasNextPage, isFetchingNextPage };
}