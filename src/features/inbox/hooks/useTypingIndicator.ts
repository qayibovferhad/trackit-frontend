import type { User } from "@/features/auth/types/auth.type";
import { useCallback, useMemo } from "react";
import type { Socket } from "socket.io-client";

export function useTypingIndicator(
  conversationId: string | undefined,
  socket: Socket | null,
  user: User | null
) {
  const handleTyping = useCallback((isTyping: boolean) => {
    if (!conversationId || !socket || !user) return;

    socket.emit("typing", {
      conversationId,
      isTyping,
      name: user.name,
      avatar: user.profileImage
    });
  }, [conversationId, socket, user]);

  const currentTypingUsers = useMemo(() => {
    // Implement typing users logic based on your store structure
    return [];
  }, [conversationId]);

  return { handleTyping, currentTypingUsers };
}